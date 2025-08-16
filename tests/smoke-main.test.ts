import { test, expect } from "bun:test"
import { readFile } from "node:fs/promises"
import path from "node:path"

// Minimal smoke test: the main (React) bundle file exists and is non-empty after build

test("main smoke: dist/index.js exists and is non-empty", async () => {
  const distIndexPath = path.resolve(import.meta.dirname, "../dist/index.js")
  const content = await readFile(distIndexPath, "utf8")
  expect(typeof content).toBe("string")
  expect(content.length).toBeGreaterThan(0)
})
