import { expect } from "bun:test"
import { dirname, basename, join } from "node:path"
import looksSame from "looks-same"

export async function expectPngSnapshot(actual: Uint8Array, testPath: string) {
  const path = join(
    dirname(testPath),
    "__snapshots__",
    `${basename(testPath, ".test.ts")}.snap.png`,
  )
  if (
    process.env.BUN_UPDATE_SNAPSHOTS === "1" ||
    process.argv.includes("-u") ||
    process.argv.includes("--update-snapshots")
  ) {
    await Bun.write(path, actual)
  }
  // A missing baseline fails unless an update was explicitly requested.
  const reference = Buffer.from(await Bun.file(path).arrayBuffer())
  const result = await looksSame(reference, Buffer.from(actual), {
    tolerance: 2,
  })
  if (!result.equal) {
    const diff = await looksSame.createDiff({
      reference,
      current: Buffer.from(actual),
      highlightColor: "#ff00ff",
    })
    await Bun.write(path.replace(".snap.png", ".diff.png"), diff)
  }
  expect(result.equal, `Visual snapshot differs: ${path}`).toBe(true)
}
