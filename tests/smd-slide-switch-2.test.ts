import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"
test("smdslideswitch7_signalcols4_missing(2)_p1.5mm_mpx7.2mm geometry", async () => {
  const footprint = "smdslideswitch7_signalcols4_missing(2)_p1.5mm_mpx7.2mm"

  const { getJscadModelForFootprint: get } = await importVanilla()
  const { geometries } = get(footprint, jscad)
  expect(geometries.length).toBe(footprint.includes("noholes") ? 10 : 12)
  for (const { geom } of geometries)
    expect(jscad.measurements.measureVolume(geom)).toBeGreaterThan(0)
  const caseBounds = jscad.measurements.measureBoundingBox(geometries[0]!.geom)
  expect(caseBounds[1][2] - caseBounds[0][2]).toBeCloseTo(
    footprint.includes("7.2") ? 1.5 : 1.4,
    2,
  )
  const base = geometries[1]!.geom
  for (const { geom } of geometries.slice(-7, -4))
    expect(
      jscad.measurements.measureVolume(jscad.booleans.intersect(base, geom)),
    ).toBeGreaterThan(0)
  const knobBounds = jscad.measurements.measureBoundingBox(geometries[2]!.geom)
  expect(knobBounds[0][1]).toBeLessThan(caseBounds[0][1])
})
