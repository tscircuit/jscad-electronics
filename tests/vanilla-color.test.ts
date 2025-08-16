import { test, expect } from "bun:test"
import { importVanilla } from "./fixtures/importVanilla.js"

test("vanilla build preserves some color metadata (soic8)", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const res = getJscadModelForFootprint("soic8")
  const withColor = res.geometries.filter((g: any) => g.color != null)
  expect(withColor.length).toBeGreaterThan(0)
})
