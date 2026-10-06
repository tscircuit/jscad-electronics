import { expect } from "bun:test"
import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  utimes,
  writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { mp } from "@tscircuit/modelprinter"
import { generateModelRenderers } from "../../scripts/generate-model-renderers.mjs"
import { ModelRendererRegistry } from "../../lib/model-registry"

const registryPath = fileURLToPath(
  new URL("../../lib/model-registry.ts", import.meta.url),
)
const generatorUrl = new URL(
  "../../scripts/generate-model-renderers.mjs",
  import.meta.url,
).href
const reactSpecifier = import.meta.resolve("react")
const modelprinterSpecifier = import.meta.resolve("@tscircuit/modelprinter")
const generatedFiles = [
  "model-renderers.ts",
  "models.ts",
  "vanilla-models.ts",
] as const

interface GeneratedFixtureModule {
  builtinModelRenderers: readonly { name: string }[]
  registerAllModelRenderers(registry: ModelRendererRegistry): void
}

async function addRenderer(modelsDir: string, folder: "alpha" | "beta") {
  const name = folder === "alpha" ? "spurgear" : "wormgear"
  const schema =
    folder === "alpha"
      ? "spurGearModelDefinitionSchema"
      : "wormGearModelDefinitionSchema"
  const extension = folder === "alpha" ? "tsx" : "ts"
  const modelDir = join(modelsDir, folder)
  await mkdir(modelDir, { recursive: true })
  await writeFile(
    join(modelDir, `register.${extension}`),
    `
import { createElement } from ${JSON.stringify(reactSpecifier)}
import { ${schema} } from ${JSON.stringify(modelprinterSpecifier)}
import { defineModelRenderer, type ModelRendererRegistry } from ${JSON.stringify(registryPath)}
export const model = defineModelRenderer({ name: ${JSON.stringify(name)}, schema: ${schema}, render: () => createElement("span", { "data-fixture": ${JSON.stringify(folder)} }), pads: "none" })
export function register(registry: ModelRendererRegistry): void { registry.register(model) }
`,
  )
  await writeFile(
    join(modelDir, "index.ts"),
    `export const ${folder}Public = ${JSON.stringify(folder)}\n`,
  )
  if (folder === "beta") {
    await writeFile(
      join(modelDir, "vanilla.ts"),
      'export const betaVanilla = "vanilla override"\n',
    )
  }
}

async function loadRevision(
  outputDir: string,
  filename: string,
  revision: number,
) {
  // Query strings do not invalidate Bun's filesystem-module cache. Load an
  // adjacent temporary filename to observe each revision's relative imports.
  const revisionFile = join(outputDir, `${revision}-${filename}`)
  await writeFile(
    revisionFile,
    await readFile(join(outputDir, filename), "utf8"),
  )
  try {
    return await import(pathToFileURL(revisionFile).href)
  } finally {
    await rm(revisionFile)
  }
}

async function generateWithNode(modelsDir: string, outputDir: string) {
  const node = Bun.which("node")
  if (!node)
    throw new Error("Node is required to verify generator fallback without Bun")
  const resultFile = join(dirname(outputDir), "node-result.json")
  const child = Bun.spawn(
    [
      node,
      "--input-type=module",
      "-e",
      `
import { generateModelRenderers } from ${JSON.stringify(generatorUrl)}
import { writeFile } from "node:fs/promises"
if (typeof globalThis.Bun !== "undefined") throw new Error("Fallback must not require Bun")
const result = await generateModelRenderers(${JSON.stringify({ modelsDir, outputDir, registryModuleSpecifier: registryPath })})
await writeFile(${JSON.stringify(resultFile)}, JSON.stringify(result))
`,
    ],
    { stdout: "pipe", stderr: "pipe" },
  )
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ])
  if (exitCode !== 0)
    throw new Error(`Node generator exited ${exitCode}: ${stderr}`)
  try {
    return JSON.parse(await readFile(resultFile, "utf8")) as Awaited<
      ReturnType<typeof generateModelRenderers>
    >
  } finally {
    await rm(resultFile, { force: true })
  }
}

export async function assertModelRendererGeneration() {
  const temporary = await mkdtemp(join(tmpdir(), "jscad-model-discovery-"))
  try {
    const modelsDir = join(temporary, "first/lib/models")
    const outputDir = join(temporary, "first/lib/generated")
    const options = {
      modelsDir,
      outputDir,
      registryModuleSpecifier: registryPath,
      discoveryBackend: "bun" as const,
    }
    await addRenderer(modelsDir, "alpha")
    await mkdir(join(modelsDir, ".hidden"), { recursive: true })
    await writeFile(
      join(modelsDir, ".hidden/register.ts"),
      "throw new Error('hidden adapters must be ignored')\n",
    )
    await mkdir(join(modelsDir, "ignored/nested"), { recursive: true })
    await writeFile(
      join(modelsDir, "ignored/nested/register.tsx"),
      "throw new Error('nested adapters must be ignored')\n",
    )
    await writeFile(
      join(modelsDir, "ignored/vanilla.ts"),
      "throw new Error('override without adapter must be ignored')\n",
    )
    const first = await generateModelRenderers(options)
    expect(first.modelDirectories).toEqual(["alpha"])
    expect(first.changedFiles).toEqual([...generatedFiles])
    const single = (await loadRevision(
      outputDir,
      "model-renderers.ts",
      1,
    )) as GeneratedFixtureModule
    expect(single.builtinModelRenderers.map((model) => model.name)).toEqual([
      "spurgear",
    ])
    const firstRegistry = new ModelRendererRegistry()
    single.registerAllModelRenderers(firstRegistry)
    expect(firstRegistry.getModelNames()).toEqual(["spurgear"])
    expect<unknown>(
      firstRegistry.render(mp.string("spurgear").json())?.props,
    ).toEqual({ "data-fixture": "alpha" })
    expect(firstRegistry.render(mp.string("wormgear").json())).toBeUndefined()

    const fixedTime = new Date("2001-01-01T00:00:00.000Z")
    for (const filename of generatedFiles)
      await utimes(join(outputDir, filename), fixedTime, fixedTime)
    const unchanged = await generateModelRenderers(options)
    expect(unchanged.sources).toEqual(first.sources)
    expect(unchanged.changedFiles).toEqual([])
    const node = await generateWithNode(modelsDir, outputDir)
    expect(node.sources).toEqual(first.sources)
    expect(node.modelDirectories).toEqual(first.modelDirectories)
    expect(node.changedFiles).toEqual([])
    for (const filename of generatedFiles)
      expect((await stat(join(outputDir, filename))).mtimeMs).toBe(
        fixedTime.getTime(),
      )

    await addRenderer(modelsDir, "beta")
    const added = await generateModelRenderers(options)
    expect(added.modelDirectories).toEqual(["alpha", "beta"])
    expect(added.changedFiles).toEqual([...generatedFiles])
    expect((await generateWithNode(modelsDir, outputDir)).sources).toEqual(
      added.sources,
    )
    const multiple = (await loadRevision(
      outputDir,
      "model-renderers.ts",
      2,
    )) as GeneratedFixtureModule
    const registry = new ModelRendererRegistry()
    multiple.registerAllModelRenderers(registry)
    expect(registry.getModelNames()).toEqual(["spurgear", "wormgear"])
    expect<unknown>(
      registry.render(mp.string("wormgear").json())?.props,
    ).toEqual({ "data-fixture": "beta" })
    const publicModels = await loadRevision(outputDir, "models.ts", 2)
    const vanillaModels = await loadRevision(outputDir, "vanilla-models.ts", 2)
    expect(publicModels.alphaPublic).toBe("alpha")
    expect(publicModels.betaPublic).toBe("beta")
    expect(vanillaModels.alphaPublic).toBe("alpha")
    expect(vanillaModels.betaPublic).toBeUndefined()
    expect(vanillaModels.betaVanilla).toBe("vanilla override")

    const otherModelsDir = join(temporary, "second/lib/models")
    const otherOutputDir = join(temporary, "second/lib/generated")
    await addRenderer(otherModelsDir, "beta")
    await addRenderer(otherModelsDir, "alpha")
    expect(
      (
        await generateModelRenderers({
          ...options,
          modelsDir: otherModelsDir,
          outputDir: otherOutputDir,
        })
      ).sources,
    ).toEqual(added.sources)

    const duplicateFile = join(modelsDir, "alpha/register.ts")
    await writeFile(duplicateFile, "export {}\n")
    for (const discoveryBackend of ["bun", "node"] as const) {
      await expect(
        generateModelRenderers({ ...options, discoveryBackend }),
      ).rejects.toThrow("Duplicate renderer registration adapters in alpha")
    }
    for (const filename of generatedFiles)
      expect(await readFile(join(outputDir, filename), "utf8")).toBe(
        added.sources[filename],
      )
    await rm(duplicateFile)

    await rm(join(modelsDir, "beta"), { recursive: true })
    const removed = await generateModelRenderers(options)
    expect(removed.sources).toEqual(first.sources)
    expect(removed.modelDirectories).toEqual(["alpha"])
    const remaining = (await loadRevision(
      outputDir,
      "model-renderers.ts",
      3,
    )) as GeneratedFixtureModule
    const remainingRegistry = new ModelRendererRegistry()
    remaining.registerAllModelRenderers(remainingRegistry)
    expect(remainingRegistry.get("wormgear")).toBeUndefined()
    expect(
      remainingRegistry.render(mp.string("wormgear").json()),
    ).toBeUndefined()
    expect(registry.getModelNames()).toEqual(["spurgear", "wormgear"])
    const priorTimes = await Promise.all(
      generatedFiles.map(
        async (filename) => (await stat(join(outputDir, filename))).mtimeMs,
      ),
    )
    await rm(join(modelsDir, "alpha"), { recursive: true })
    for (const discoveryBackend of ["bun", "node"] as const) {
      await expect(
        generateModelRenderers({ ...options, discoveryBackend }),
      ).rejects.toThrow(
        `No renderer registration adapters found in ${modelsDir}`,
      )
    }
    for (const [index, filename] of generatedFiles.entries()) {
      expect(await readFile(join(outputDir, filename), "utf8")).toBe(
        first.sources[filename],
      )
      expect((await stat(join(outputDir, filename))).mtimeMs).toBe(
        priorTimes[index]!,
      )
    }
    expect((await readdir(outputDir)).sort()).toEqual(
      [...generatedFiles].sort(),
    )
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
}
