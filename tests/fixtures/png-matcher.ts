import { expect, type MatcherResult } from "bun:test"
import * as fs from "node:fs"
import * as path from "node:path"
import looksSame from "looks-same"

/**
 * Matcher for PNG snapshot testing with cross-platform tolerance.
 *
 * Usage:
 *   expect(pngBuffer).toMatchPngSnapshot(import.meta.path, "optionalName");
 */
async function toMatchPngSnapshot(
  // biome-ignore lint/suspicious/noExplicitAny: bun doesn't expose
  this: any,
  receivedMaybePromise: Buffer | Uint8Array | Promise<Buffer | Uint8Array>,
  testPathOriginal: string,
  pngName?: string,
): Promise<MatcherResult> {
  const received = await receivedMaybePromise
  const testPath = testPathOriginal
    .replace(/\.test\.tsx?$/, "")
    .replace(/\.test\.ts$/, "")
  const snapshotDir = path.join(path.dirname(testPath), "__snapshots__")
  const snapshotName = pngName
    ? `${pngName}.snap.png`
    : `${path.basename(testPath)}.snap.png`
  const filePath = path.join(snapshotDir, snapshotName)

  if (!fs.existsSync(snapshotDir)) {
    fs.mkdirSync(snapshotDir, { recursive: true })
  }

  const updateSnapshot =
    process.argv.includes("--update-snapshots") ||
    process.argv.includes("-u") ||
    Boolean(process.env["BUN_UPDATE_SNAPSHOTS"])
  const forceUpdate = Boolean(process.env["FORCE_BUN_UPDATE_SNAPSHOTS"])

  const fileExists = fs.existsSync(filePath)

  if (!fileExists) {
    console.log("Writing PNG snapshot to", filePath)
    fs.writeFileSync(filePath, received)
    return {
      message: () => `PNG snapshot created at ${filePath}`,
      pass: true,
    }
  }

  const existingSnapshot = fs.readFileSync(filePath)

  const result: any = await looksSame(
    Buffer.from(received),
    Buffer.from(existingSnapshot),
    {
      strict: false,
      tolerance: 5,
      antialiasingTolerance: 4,
      ignoreCaret: true,
      shouldCluster: true,
      clustersSize: 10,
    },
  )

  if (updateSnapshot) {
    if (!forceUpdate && result.equal) {
      return {
        message: () => "PNG snapshot matches",
        pass: true,
      }
    }
    console.log("Updating PNG snapshot at", filePath)
    fs.writeFileSync(filePath, received)
    return {
      message: () => `PNG snapshot updated at ${filePath}`,
      pass: true,
    }
  }

  if (result.equal) {
    return {
      message: () => "PNG snapshot matches",
      pass: true,
    }
  }

  // Calculate diff percentage for cross-platform tolerance
  if (result.diffBounds) {
    // Get image dimensions from the PNG buffer
    const width = existingSnapshot.readUInt32BE(16)
    const height = existingSnapshot.readUInt32BE(20)
    const totalPixels = width * height

    const diffArea =
      (result.diffBounds.right - result.diffBounds.left) *
      (result.diffBounds.bottom - result.diffBounds.top)
    const diffPercentage = (diffArea / totalPixels) * 100

    // Allow up to 5% pixel difference for cross-platform rendering variations
    const ACCEPTABLE_DIFF_PERCENTAGE = 5.0

    if (diffPercentage <= ACCEPTABLE_DIFF_PERCENTAGE) {
      console.log(
        `✓ PNG snapshot matches (${diffPercentage.toFixed(3)}% difference, within ${ACCEPTABLE_DIFF_PERCENTAGE}% threshold)`,
      )
      return {
        message: () =>
          `PNG snapshot matches (${diffPercentage.toFixed(3)}% difference)`,
        pass: true,
      }
    }

    // If difference is too large, create diff image
    const diffPath = filePath.replace(/\.snap\.png$/, ".diff.png")
    await looksSame.createDiff({
      reference: Buffer.from(existingSnapshot),
      current: Buffer.from(received),
      diff: diffPath,
      highlightColor: "#ff00ff",
    })

    return {
      message: () =>
        `PNG snapshot differs by ${diffPercentage.toFixed(3)}% (threshold: ${ACCEPTABLE_DIFF_PERCENTAGE}%). Diff saved at ${diffPath}. Use BUN_UPDATE_SNAPSHOTS=1 to update the snapshot.`,
      pass: false,
    }
  }

  // Fallback if diffBounds isn't available
  const diffPath = filePath.replace(/\.snap\.png$/, ".diff.png")
  await looksSame.createDiff({
    reference: Buffer.from(existingSnapshot),
    current: Buffer.from(received),
    diff: diffPath,
    highlightColor: "#ff00ff",
  })

  console.log(`📸 Snapshot mismatch (no diff bounds available)`)
  console.log(`   Diff saved: ${diffPath}`)

  return {
    message: () => `PNG snapshot does not match. Diff saved at ${diffPath}`,
    pass: false,
  }
}

// Register the matcher globally for Bun's expect
expect.extend({
  toMatchPngSnapshot: toMatchPngSnapshot as any,
})

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchPngSnapshot(
      testPath: string,
      pngName?: string,
    ): Promise<MatcherResult>
  }
}
