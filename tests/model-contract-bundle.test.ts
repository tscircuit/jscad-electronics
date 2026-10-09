import { expect, test } from "bun:test"
import { readFile } from "node:fs/promises"

test("published entrypoints carry contracts without external modelprinter imports", async () => {
  const manifest = await Bun.file(
    new URL("../package.json", import.meta.url),
  ).json()
  expect(manifest.dependencies?.["@tscircuit/modelprinter"]).toBeUndefined()
  for (const entry of ["index", "vanilla", "cables"]) {
    for (const extension of ["js", "d.ts"]) {
      const content = await readFile(
        new URL(`../dist/${entry}.${extension}`, import.meta.url),
        "utf8",
      )
      expect(content).not.toMatch(
        /(?:from\s*|import\s*\(|require\s*\()["']@tscircuit\/modelprinter(?:\/[^"']*)?["']/,
      )
    }
  }
  const provenance = await Bun.file(
    new URL("../dist/model-contracts.json", import.meta.url),
  ).json()
  expect(provenance.mainSha).toMatch(/^[a-f0-9]{40}$/)
  expect(provenance.treeSha).toMatch(/^[a-f0-9]{40}$/)
})
