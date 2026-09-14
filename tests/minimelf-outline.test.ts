import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { MINIMELF } from "../lib/MINIMELF"
import { getComponentModel } from "./helpers/component-model"

test("MiniMELF nominal outline includes connected end contacts", () => {
  const { geometries } = getComponentModel(MINIMELF, {})
  expect(geometries).toHaveLength(3)
  const [min, max] = jscad.measurements.measureAggregateBoundingBox(
    ...geometries.map(({ geom }) => geom),
  )
  expect(max[0] - min[0]).toBeCloseTo(3.5, 5)
  expect(max[1] - min[1]).toBeCloseTo(1.5, 5)
  expect(max[2] - min[2]).toBeCloseTo(1.5, 5)
  expect(min[2]).toBeCloseTo(0, 5)
  for (const { geom } of geometries) {
    expect(Number.isFinite(jscad.measurements.measureVolume(geom))).toBe(true)
    expect(jscad.measurements.measureVolume(geom)).toBeGreaterThan(0)
  }
  for (const { geom } of geometries.slice(1)) {
    const [contactMin, contactMax] = jscad.measurements.measureBoundingBox(geom)
    expect(contactMax[0] - contactMin[0]).toBeLessThanOrEqual(0.47)
    expect(
      jscad.measurements.measureVolume(
        jscad.booleans.intersect(geometries[0]!.geom, geom),
      ),
    ).toBeGreaterThan(0)
  }
})
