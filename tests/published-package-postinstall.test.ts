import { expect, test } from "bun:test"
import { mkdtemp, readdir, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

test("the packed package completes postinstall without repository scripts", async () => {
  const packageDirectory = await mkdtemp(
    join(tmpdir(), "jscad-electronics-postinstall-"),
  )

  try {
    // The test build already produced dist. Skip source hooks only while packing;
    // execute the published consumer postinstall below without skipping it.
    const packedPackage = Bun.spawnSync(
      [
        "npm",
        "pack",
        "--offline",
        "--ignore-scripts",
        "--pack-destination",
        packageDirectory,
      ],
      { cwd: join(import.meta.dir, "..") },
    )
    expect(packedPackage.exitCode, packedPackage.stderr.toString()).toBe(0)

    const packageArchive = (await readdir(packageDirectory)).find((filename) =>
      filename.endsWith(".tgz"),
    )
    if (!packageArchive) throw new Error("npm pack did not create an archive")

    const extractedPackage = Bun.spawnSync([
      "tar",
      "-xzf",
      join(packageDirectory, packageArchive),
      "-C",
      packageDirectory,
    ])
    expect(extractedPackage.exitCode, extractedPackage.stderr.toString()).toBe(
      0,
    )

    const consumerPostinstall = Bun.spawnSync(
      ["npm", "run", "--offline", "--if-present", "postinstall"],
      { cwd: join(packageDirectory, "package") },
    )
    expect(
      consumerPostinstall.exitCode,
      consumerPostinstall.stderr.toString(),
    ).toBe(0)
  } finally {
    await rm(packageDirectory, { recursive: true, force: true })
  }
})
