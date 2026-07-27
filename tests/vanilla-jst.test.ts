import { expect, test } from "bun:test"
import * as jscadModeling from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"

const supportedJstFootprints = [
  "jst2",
  "jst2_ph",
  "jst2_sh",
  "jst2_zh",
  "jst2_smd",
] as const

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

test("generic JST SMD honors custom signal and mounting pad parameters", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const result = getJscadModelForFootprint(
    "jst4_smd_p2mm_mpx8mm_mpy3mm_mpw2mm_mpl3.4mm_mounttop",
    jscadModeling,
  )
  const [minimum, maximum] =
    jscadModeling.measurements.measureAggregateBoundingBox(
      ...result.geometries.map(({ geom }: { geom: any }) => geom),
    )

  expect(result.geometries.length).toBeGreaterThan(0)
  expect(minimum[0] <= -4.99).toBe(true)
  expect(maximum[0] >= 4.99).toBe(true)
  expect(maximum[1] >= 4.69).toBe(true)
})
