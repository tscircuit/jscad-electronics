import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"

test("header modules use the matching pin-row model", async () => {
  const { getJscadModelForFootprint: get } = await importVanilla()
  for (const suffix of ["", "_female", "_rows2_female"]) {
    const module = get(`headermodule4${suffix}`, jscad).geometries
    const header = get(`pinrow4${suffix}`, jscad).geometries
    expect(module.length).toBeGreaterThan(0)
    expect(module.length).toBe(header.length)
    for (const [index, { geom }] of module.entries())
      expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(
        jscad.measurements.measureVolume(header[index]!.geom),
        8,
      )
    const bounds = (geometries: typeof module) =>
      jscad.measurements.measureAggregateBoundingBox(
        ...geometries.map(({ geom }) => geom),
      )
    const moduleBounds = bounds(module)
    const headerBounds = bounds(header)
    for (const axis of [0, 1, 2]) {
      expect(moduleBounds[0][axis]).toBeCloseTo(headerBounds[0][axis]!, 6)
      expect(moduleBounds[1][axis]).toBeCloseTo(headerBounds[1][axis]!, 6)
    }
  }
})
