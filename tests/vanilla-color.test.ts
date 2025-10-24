import { test, expect } from "bun:test"
import { importVanilla } from "./fixtures/importVanilla.js"
import * as jscadModeling from "@jscad/modeling"

test("vanilla build preserves some color metadata (soic8)", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const res = getJscadModelForFootprint("soic8", jscadModeling)
  const withColor = res.geometries.filter((g: any) => g.color != null)
  expect(withColor.length).toBeGreaterThan(0)
})

test("vanilla build preserves some color metadata (smc)", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const res = getJscadModelForFootprint("smc", jscadModeling)
  const withColor = res.geometries.filter((g: any) => g.color != null)
  expect(withColor.length).toBeGreaterThan(0)
})
