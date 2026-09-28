import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { lcc68Standard } from "../examples/fixtures/lcc68-standard"
import { LCC68 } from "../lib/LCC68"
import { getComponentModel } from "./helpers/component-model"

test("LCC68: onsemi 115AR package dimensions and 68 contacts", () => {
  const p = lcc68Standard
  const solids = getComponentModel(LCC68, p).geometries.map((g) => g.geom)
  expect(solids).toHaveLength(70)
  const bounds = jscad.measurements.measureAggregateBoundingBox(...solids)
  expect(bounds[1][0] - bounds[0][0]).toBeCloseTo(p.bodySize, 5)
  expect(bounds[1][1] - bounds[0][1]).toBeCloseTo(p.bodySize, 5)
  expect(bounds[1][2] - bounds[0][2]).toBeCloseTo(p.height, 5)
  expect(bounds[0][2]).toBeCloseTo(0, 6)
  for (const contact of solids.slice(2)) {
    expect(jscad.measurements.measureVolume(contact)).toBeGreaterThan(0)
    expect(jscad.measurements.measureBoundingBox(contact)[0][2]).toBeCloseTo(
      0,
      6,
    )
  }
  const first = jscad.measurements.measureBoundingBox(solids[2]!)[0][1]
  const second = jscad.measurements.measureBoundingBox(solids[6]!)[0][1]
  expect(second - first).toBeCloseTo(p.contactPitch, 6)
  expect(() => LCC68({ ...p, contactPitch: Number.NaN })).toThrow()
  expect(() => LCC68({ ...p, contactWidth: p.contactPitch })).toThrow()
})
