import { expect, test } from "bun:test"
import * as jscadModeling from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"

const supportedJstFootprints = ["jst2", "jst2_ph", "jst2_zh"] as const

for (const footprint of supportedJstFootprints) {
  test(`vanilla build returns geometries for ${footprint}`, async () => {
    const { getJscadModelForFootprint } = await importVanilla()
    const result = getJscadModelForFootprint(footprint, jscadModeling)

    expect(result.geometries.length).toBeGreaterThan(0)
    expect(
      result.geometries.some(({ color }: { color?: unknown }) => color != null),
    ).toBe(true)
  })
}

test("generic JST uses the PH model and keeps the PH pad offset", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const result = getJscadModelForFootprint("jst2", jscadModeling)
  const [minimum, maximum] =
    jscadModeling.measurements.measureAggregateBoundingBox(
      ...result.geometries.map(({ geom }: { geom: any }) => geom),
    )

  expect(minimum[1]).toBeLessThan(0)
  expect(maximum[1]).toBeGreaterThan(2)
})

test("custom ZH pitch is forwarded to the model", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const result = getJscadModelForFootprint("jst2_zh_p1.6mm", jscadModeling)
  const [minimum, maximum] =
    jscadModeling.measurements.measureAggregateBoundingBox(
      ...result.geometries.map(({ geom }: { geom: any }) => geom),
    )

  expect(result.geometries.length).toBeGreaterThan(0)
  expect(maximum[0] - minimum[0]).toBeGreaterThan(5.5)
})
