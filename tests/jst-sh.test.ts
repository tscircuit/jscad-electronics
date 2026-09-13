import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"
import { isJstShFootprint } from "../lib/JstSh"
for (const n of [2, 6, 12])
  test(`SH${n} physical envelope and contact count`, async () => {
    const { getJscadModelForFootprint: get } = await importVanilla()
    const { geometries } = get(`jst${n}_sh`, jscad)
    expect(geometries).toHaveLength(n + 3)
    for (const { geom } of geometries)
      expect(jscad.measurements.measureVolume(geom)).toBeGreaterThan(0)
    const bounds = jscad.measurements.measureBoundingBox(geometries[0]!.geom)
    expect(bounds[1][0] - bounds[0][0]).toBeCloseTo(n + 2, 4)
    expect(bounds[1][1] - bounds[0][1]).toBeCloseTo(2.9, 4)
    expect(bounds[1][2]).toBeCloseTo(4.25, 4)
    const centerY = (bounds[0][1] + bounds[1][1]) / 2
    const cavity = jscad.primitives.cuboid({
      size: [0.4, 0.4, 0.4],
      center: [0, centerY, 3.7],
    })
    expect(
      jscad.measurements.measureVolume(
        jscad.booleans.intersect(geometries[0]!.geom, cavity),
      ),
    ).toBeCloseTo(0, 5)
  })
test("generic connector selection requires the SH mounting layout", () => {
  expect(
    isJstShFootprint("jst12_smd_p1mm_pw0.6mm_pl1.55mm_mpx13.6mm_mpy2.525mm"),
  ).toBe(true)
  expect(isJstShFootprint("jst4_smd_p1mm_mpx9mm_mpy4mm")).toBe(false)
  expect(isJstShFootprint("jst4_smd_p2mm")).toBe(false)
})
