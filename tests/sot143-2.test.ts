import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"
test("sot143_pin1location(leftside,top) geometry", async () => {
  const footprint = "sot143_pin1location(leftside,top)"

  const { getJscadModelForFootprint } = await importVanilla()
  const { geometries } = getJscadModelForFootprint(footprint, jscad)
  expect(geometries).toHaveLength(5)
  for (const { geom } of geometries)
    expect(jscad.measurements.measureVolume(geom)).toBeGreaterThan(0)
  const body = jscad.measurements.measureBoundingBox(geometries[0]!.geom)
  expect(body[1][2] - body[0][2]).toBeCloseTo(0.95, 2)
  const leads = geometries
    .slice(1)
    .map(({ geom }: any) => jscad.measurements.measureVolume(geom))
  expect(leads[0] / leads[1]).toBeCloseTo(0.83 / 0.43, 2)
})
