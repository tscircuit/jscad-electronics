import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"
test("midmount shell is hollow with twelve tails and four tabs", async () => {
  const { getJscadModelForFootprint: get } = await importVanilla()
  const { geometries } = get("usbcmidmount16", jscad)
  expect(geometries.length).toBe(37)
  for (const { geom } of geometries)
    expect(jscad.measurements.measureVolume(geom)).toBeGreaterThan(0)
  const shell = geometries[0]!.geom
  const probe = jscad.primitives.cuboid({
    size: [1, 2, 0.3],
    center: [0, -4, 2.5],
  })
  expect(
    jscad.measurements.measureVolume(jscad.booleans.intersect(shell, probe)),
  ).toBeCloseTo(0, 5)
  const bounds = jscad.measurements.measureBoundingBox(shell)
  expect(bounds[1][0] - bounds[0][0]).toBeCloseTo(8.94, 2)
  expect(bounds[1][2] - bounds[0][2]).toBeCloseTo(3.2, 2)
  const tabs = geometries.slice(-4)
  for (const { geom } of tabs)
    expect(jscad.measurements.measureBoundingBox(geom)[0][2]).toBeLessThan(0)
})
