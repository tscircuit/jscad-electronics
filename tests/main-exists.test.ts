import { test, expect } from "bun:test"
import { readFile } from "node:fs/promises"
import path from "node:path"

// Ensures the legacy (React) entry still builds and is exported at package root

test("main export points to dist/index.js and file exists", async () => {
  const pkgPath = path.resolve(import.meta.dirname, "../package.json")
  const pkg = JSON.parse(await readFile(pkgPath, "utf8")) as any

  // basic shape
  expect(pkg.main).toBe("./dist/index.js")
  expect(pkg.exports?.["."]?.import).toBe("./dist/index.js")

  const distIndexPath = path.resolve(import.meta.dirname, "../dist/index.js")
  const content = await readFile(distIndexPath, "utf8")
  expect(typeof content).toBe("string")
  expect(content.length).toBeGreaterThan(0)
})
