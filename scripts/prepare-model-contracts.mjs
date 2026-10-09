import { execFileSync } from "node:child_process"
import { randomUUID } from "node:crypto"
import {
  lstat,
  mkdir,
  open,
  readFile,
  realpath,
  rename,
  rm,
  stat,
  symlink,
  writeFile,
} from "node:fs/promises"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = fileURLToPath(new URL("../", import.meta.url))
const cache = path.join(root, ".model-contracts")
const repository = "https://github.com/tscircuit/modelprinter.git"
const provenanceFile = path.join(cache, "provenance.json")
const generations = path.join(cache, "generations")
const lockDirectory = path.join(cache, "preparation.lock")
const cacheVersion = 2
let preparation

export function selectContractRef(env = process.env, event = {}) {
  if (env.MODELPRINTER_REF) {
    if (!/^[a-f0-9]{40}$/i.test(env.MODELPRINTER_REF)) {
      throw new Error("MODELPRINTER_REF must be a full 40-character commit SHA")
    }
    return env.MODELPRINTER_REF
  }
  if (env.MODELPRINTER_PR) {
    const match = env.MODELPRINTER_PR.match(
      /^(?:https:\/\/github\.com\/tscircuit\/modelprinter\/pull\/)?([1-9]\d*)\/?$/,
    )
    if (!match) throw new Error("MODELPRINTER_PR must be a PR number or URL")
    return `refs/pull/${match[1]}/head`
  }
  const body = event.pull_request?.body ?? ""
  const numbers = new Set(
    [
      ...body.matchAll(
        /https:\/\/github\.com\/tscircuit\/modelprinter\/pull\/([1-9]\d*)(?!\d)/g,
      ),
    ].map((match) => match[1]),
  )
  if (numbers.size > 1) {
    throw new Error(
      "Multiple modelprinter PRs are linked. Set MODELPRINTER_PR to the paired contract explicitly.",
    )
  }
  return numbers.size ? `refs/pull/${[...numbers][0]}/head` : null
}

function run(command, args, cwd = root, capture = false) {
  try {
    return execFileSync(command, args, {
      cwd,
      encoding: "utf8",
      stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
      env: process.env,
    })?.trim()
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(
        command === (process.env.MODELPRINTER_BUN ?? "bun")
          ? "Model contract preparation needs Bun. Install Bun or set MODELPRINTER_BUN to its executable path."
          : `Model contract preparation needs ${command} on PATH.`,
        { cause: error },
      )
    }
    throw new Error(
      `Model contract preparation failed: ${command} ${args.join(" ")}`,
      {
        cause: error,
      },
    )
  }
}

async function readJSON(filename) {
  try {
    return JSON.parse(await readFile(filename, "utf8"))
  } catch (error) {
    if (error.code === "ENOENT") return null
    throw error
  }
}

function processExists(pid) {
  if (!Number.isInteger(pid) || pid < 1) return false
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    return error.code !== "ESRCH"
  }
}

async function lockOwner() {
  try {
    return await readJSON(path.join(lockDirectory, "owner.json"))
  } catch (error) {
    if (error.code === "ENOENT" || error instanceof SyntaxError) return null
    throw error
  }
}

async function recoverLock(owner) {
  // One contender claims stale-lock recovery before moving the old directory.
  // Rechecking its owner avoids removing a lock another process just acquired.
  const recoveryFile = path.join(lockDirectory, "recovery.json")
  let handle
  let recovered = false
  try {
    handle = await open(recoveryFile, "wx")
    await handle.writeFile(JSON.stringify({ pid: process.pid }))
    const current = await lockOwner()
    if (
      current?.token !== owner?.token ||
      (current && processExists(current.pid))
    ) {
      return false
    }
    const stale = `${lockDirectory}.stale-${randomUUID()}`
    await rename(lockDirectory, stale)
    recovered = true
    await rm(stale, { recursive: true, force: true })
  } catch (error) {
    if (!["EEXIST", "ENOENT"].includes(error.code)) throw error
    if (error.code === "EEXIST") {
      const recovery = await readJSON(recoveryFile).catch(() => null)
      const age =
        Date.now() - (await stat(recoveryFile).catch(() => null))?.mtimeMs
      if ((!recovery || !processExists(recovery.pid)) && age > 10000) {
        await rm(recoveryFile, { force: true })
      }
    }
  } finally {
    if (handle) {
      await handle.close()
      // Successful recovery moved this file with the stale directory. Never
      // remove a recovery file belonging to a newly acquired lock.
      const current = await lockOwner()
      if (!recovered && current?.token === owner?.token) {
        await rm(recoveryFile, { force: true })
      }
    }
  }
  return recovered
}

async function acquirePreparationLock() {
  await mkdir(cache, { recursive: true })
  const token = randomUUID(),
    started = Date.now()
  while (true) {
    try {
      await mkdir(lockDirectory)
      await writeFile(
        path.join(lockDirectory, "owner.json"),
        JSON.stringify({ pid: process.pid, token, createdAt: Date.now() }),
        { flag: "wx" },
      )
      return async () => {
        if ((await lockOwner())?.token === token) {
          await rm(lockDirectory, { recursive: true, force: true })
        }
      }
    } catch (error) {
      if (error.code !== "EEXIST") throw error
    }
    const owner = await lockOwner()
    const age =
      Date.now() - (await stat(lockDirectory).catch(() => null))?.mtimeMs
    if ((owner && !processExists(owner.pid)) || (!owner && age > 10000)) {
      if (await recoverLock(owner)) continue
    }
    if (Date.now() - started > 180000) {
      throw new Error(
        "Another model contract preparation is still running. Wait for it to finish and try again.",
      )
    }
    await new Promise((resolve) => setTimeout(resolve, 150))
  }
}

function generationSource(provenance) {
  if (
    provenance?.cacheVersion !== cacheVersion ||
    typeof provenance.generation !== "string" ||
    !new RegExp(
      `^generations/[a-f0-9]{40}-v${cacheVersion}(?:-[a-f0-9-]+)?$`,
    ).test(provenance.generation)
  )
    return null
  return path.join(cache, provenance.generation)
}

async function validGeneration(source, treeSha) {
  if (!source) return false
  const completed = await readJSON(
    path.join(source, ".model-contract-build.json"),
  ).catch(() => null)
  if (
    completed?.cacheVersion !== cacheVersion ||
    completed.treeSha !== treeSha
  ) {
    return false
  }
  const manifest = await readJSON(path.join(source, "package.json")).catch(
    () => null,
  )
  if (manifest?.name !== "@tscircuit/modelprinter") return false
  return await Promise.all(
    ["index.js", "index.d.ts"].map((filename) =>
      readFile(path.join(source, filename)),
    ),
  ).then(
    () => true,
    () => false,
  )
}

async function writeJSONAtomic(filename, value) {
  const temporary = `${filename}.${process.pid}.${randomUUID()}.tmp`
  try {
    await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, {
      flag: "wx",
    })
    await rename(temporary, filename)
  } finally {
    await rm(temporary, { force: true })
  }
}

async function linkContracts(source) {
  const target = path.join(root, "node_modules/@tscircuit/modelprinter")
  if ((await realpath(target).catch(() => null)) === source) return
  await mkdir(path.dirname(target), { recursive: true })
  const temporary = `${target}.prepared-${randomUUID()}`
  let previousDirectory
  try {
    await symlink(source, temporary, "dir")
    // Normal refreshes replace the symlink atomically. A package-manager
    // directory needs one initial adoption; retain it and restore it on error.
    const existing = await lstat(target).catch((error) => {
      if (error.code === "ENOENT") return null
      throw error
    })
    if (existing?.isDirectory() && !existing.isSymbolicLink()) {
      previousDirectory = `${target}.previous-${randomUUID()}`
      await rename(target, previousDirectory)
    }
    try {
      await rename(temporary, target)
    } catch (error) {
      if (previousDirectory) await rename(previousDirectory, target)
      throw error
    }
  } finally {
    await rm(temporary, { force: true })
  }
}

async function prepare({ refresh = false } = {}) {
  const event = process.env.GITHUB_EVENT_PATH
    ? await readJSON(process.env.GITHUB_EVENT_PATH)
    : {}
  const contractRef = selectContractRef(process.env, event)
  const mainRef = process.env.MODELPRINTER_MAIN_REF?.toLowerCase() ?? null
  if (mainRef && !/^[a-f0-9]{40}$/.test(mainRef)) {
    throw new Error(
      "MODELPRINTER_MAIN_REF must be a full 40-character commit SHA",
    )
  }
  const release = await acquirePreparationLock()
  let staging
  try {
    const previous = refresh ? null : await readJSON(provenanceFile)
    const previousSource = generationSource(previous)
    if (
      !refresh &&
      previous?.contractRef === contractRef &&
      (previous?.mainRef ?? null) === mainRef &&
      (await validGeneration(previousSource, previous?.treeSha))
    ) {
      await linkContracts(previousSource)
      return previous
    }

    // Never change the renderer manifest, a lockfile, or a remote branch. The
    // generated checkout is isolated and replaced as a single local build input.
    await mkdir(generations, { recursive: true })
    // Upstream's CLI-only tsup build searches ancestor directories for config.
    // Stop that search here so it cannot import the renderer's tsup config and
    // recursively prepare contracts while this preparation holds the lock.
    // An upstream config inside its own checkout still takes precedence.
    await writeFile(path.join(cache, "tsup.config.ts"), "export default {}\n")
    staging = path.join(cache, `staging-${process.pid}-${randomUUID()}`)
    await mkdir(staging)
    const source = staging
    run("git", ["init", "--quiet"], source)
    run("git", ["remote", "add", "origin", repository], source)
    run(
      "git",
      ["fetch", "--no-tags", "origin", mainRef ?? "refs/heads/main"],
      source,
    )
    const mainSha = run("git", ["rev-parse", "FETCH_HEAD"], source, true)
    run("git", ["checkout", "--quiet", "--detach", mainSha], source)
    let contractSha = null
    if (contractRef) {
      run("git", ["fetch", "--no-tags", "origin", contractRef], source)
      contractSha = run("git", ["rev-parse", "FETCH_HEAD"], source, true)
      // Merge, rather than replace main, so new contracts cannot erase schemas
      // required by renderers that have already been accepted. Real conflicts fail.
      run(
        "git",
        [
          "-c",
          "user.name=Model contract build",
          "-c",
          "user.email=model-contract-build@localhost",
          "merge",
          "--no-commit",
          "--no-ff",
          contractSha,
        ],
        source,
      )
    }
    const treeSha = run("git", ["write-tree"], source, true)
    let generation = path.join(generations, `${treeSha}-v${cacheVersion}`)
    if (!(await validGeneration(generation, treeSha))) {
      const bun = process.env.MODELPRINTER_BUN ?? "bun"
      run(bun, ["install", "--ignore-scripts"], source)
      run(bun, ["run", "build"], source)
      await writeJSONAtomic(path.join(source, ".model-contract-build.json"), {
        cacheVersion,
        treeSha,
      })
      if (!(await validGeneration(source, treeSha))) {
        throw new Error(
          "Modelprinter built without its package entrypoint or declarations. The previous contracts remain installed.",
        )
      }
      // A damaged old generation can still be referenced by another process.
      // Keep it intact and publish this successful build under a fresh name.
      if (await lstat(generation).catch(() => null)) {
        generation += `-${randomUUID()}`
      }
      await rename(source, generation)
      staging = undefined
    }
    const provenance = {
      cacheVersion,
      repository,
      mainRef,
      mainSha,
      contractRef,
      contractSha,
      treeSha,
      generation: path.relative(cache, generation).split(path.sep).join("/"),
    }
    await linkContracts(generation)
    await writeJSONAtomic(provenanceFile, provenance)
    console.log(
      `Prepared model contracts: main ${mainSha.slice(0, 12)}${contractSha ? ` + ${contractSha.slice(0, 12)}` : ""}`,
    )
    return provenance
  } finally {
    try {
      if (staging) await rm(staging, { recursive: true, force: true })
    } finally {
      await release()
    }
  }
}

export function prepareModelContracts(options) {
  // Build and test hooks share one preparation within the same process.
  preparation ??= prepare(options).catch((error) => {
    preparation = undefined
    throw error
  })
  return preparation
}

export async function writeContractProvenance() {
  const provenance = await prepareModelContracts()
  await mkdir(path.join(root, "dist"), { recursive: true })
  await writeJSONAtomic(
    path.join(root, "dist/model-contracts.json"),
    provenance,
  )
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  await prepareModelContracts({ refresh: process.argv.includes("--refresh") })
}
