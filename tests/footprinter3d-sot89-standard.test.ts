import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { SOT89, sot89NominalDimensions } from "../lib/SOT89"
import { importVanilla } from "./fixtures/importVanilla.js"
import { getComponentModel } from "./helpers/component-model"

test("three-lead SOT-89 uses its physical outline regardless of copper size", async () => {
  const { getJscadModelForFootprint: get } = await importVanilla()
  const expected = getComponentModel(SOT89, sot89NominalDimensions).geometries
  for (const footprint of [
    "sot89",
    "sot89_p1.495mm_w5.11mm_pw0.67mm_pl1.56mm_pin1location(rightside,bottom)",
  ]) {
    const actual = get(footprint, jscad).geometries as typeof expected
    expect(actual.length).toBe(expected.length)
    for (const [index, { geom }] of actual.entries())
      expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(
        jscad.measurements.measureVolume(expected[index]!.geom),
        6,
      )
    const bounds = jscad.measurements.measureAggregateBoundingBox(
      ...actual.map(({ geom }) => geom),
    )
    for (const [axis, size] of [4, 4.5, 1.5].entries())
      expect(bounds[1][axis]! - bounds[0][axis]!).toBeCloseTo(size, 5)
  }
  expect(get("sot89_5", jscad).geometries.length).toBeGreaterThan(0)
})
