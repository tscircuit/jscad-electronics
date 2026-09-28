import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"

function getGeometryBounds(
  geometries: Array<{ geom: jscad.geometries.geom3.Geom3 }>,
) {
  return jscad.measurements.measureAggregateBoundingBox(
    ...geometries.map(({ geom }) => geom),
  )
}

test("header modules use the matching pin-row model", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  for (const suffix of ["", "_female", "_rows2_female"]) {
    const module = getJscadModelForFootprint(
      `headermodule4${suffix}`,
      jscad,
    ).geometries
    const header = getJscadModelForFootprint(
      `pinrow4${suffix}`,
      jscad,
    ).geometries
    expect(module.length).toBeGreaterThan(0)
    expect(module.length).toBe(header.length)
    for (const [index, { geom }] of module.entries())
      expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(
        jscad.measurements.measureVolume(header[index]!.geom),
        8,
      )
    const moduleBounds = getGeometryBounds(module)
    const headerBounds = getGeometryBounds(header)
    for (const axis of [0, 1, 2]) {
      expect(moduleBounds[0][axis]).toBeCloseTo(headerBounds[0][axis]!, 6)
      expect(moduleBounds[1][axis]).toBeCloseTo(headerBounds[1][axis]!, 6)
    }
  }
})
