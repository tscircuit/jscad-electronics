import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"
import { bodyDimensionFootprints } from "../examples/fixtures/footprinter-body-dimensions"

test("body fields work independently and ignored suffixes cannot override them", async () => {
  const { getJscadModelForFootprint: get } = await importVanilla()
  for (const value of Object.values(bodyDimensionFootprints)) {
    const prefix = value.split("_bodywidth")[0]!
    for (const [field, axis, size] of [
      ["bodywidth", 0, 6],
      ["bodyheight", 1, 12],
      ["bodythickness", 2, 1.5],
    ] as const) {
      const solids = get(`${prefix}_${field}${size}mm`, jscad).geometries
      const [lo, hi] = jscad.measurements.measureBoundingBox(solids[0]!.geom)
      const actual =
        axis === 2 && prefix.startsWith("lga") ? hi[axis] : hi[axis] - lo[axis]
      expect(actual).toBeCloseTo(size, 5)
      expect(() => get(`${prefix}_${field}0mm`, jscad)).toThrow()
    }
    const baseline = get(prefix, jscad).geometries.map((g: any) => g.geom)
    const ignored = get(`${prefix}_bh9mm`, jscad).geometries.map(
      (g: any) => g.geom,
    )
    expect(jscad.measurements.measureAggregateBoundingBox(...ignored)).toEqual(
      jscad.measurements.measureAggregateBoundingBox(...baseline),
    )
  }
})
