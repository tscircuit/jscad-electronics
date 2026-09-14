import { test, expect } from "bun:test"
import * as jscad from "@jscad/modeling"
import { DO219AD } from "../lib/DO219AD"
import { do219adVariants } from "../examples/fixtures/do219ad-variants"
import { getComponentModel } from "./helpers/component-model"
test("DO219AD: dimension overrides change mold and terminal geometry", () => {
  for (const { props: p } of Object.values(do219adVariants)) {
    const solids = getComponentModel(DO219AD, p).geometries.map((g) => g.geom)
    const bounds = jscad.measurements.measureAggregateBoundingBox(...solids)
    for (const [i, expected] of [
      p.leadSpan,
      p.bodyWidth,
      p.bodyHeight,
    ].entries())
      expect(bounds[1][i]! - bounds[0][i]!).toBeCloseTo(expected, 5)
    expect(bounds[0][2]).toBeCloseTo(0, 5)
    for (const [i, length, width] of [
      [1, p.cathodeLength, p.cathodeWidth],
      [2, p.anodeLength, p.anodeWidth],
    ]) {
      const lead = solids[i!]!
      const b = jscad.measurements.measureBoundingBox(lead)
      expect(b[1][0] - b[0][0]).toBeCloseTo(length!, 5)
      expect(b[1][1] - b[0][1]).toBeCloseTo(width!, 5)
      expect(
        jscad.measurements.measureVolume(
          jscad.booleans.intersect(solids[0]!, lead),
        ),
      ).toBeGreaterThan(0)
    }
    const unmarked = getComponentModel(DO219AD, {
      ...p,
      markingWidth: 0,
    }).geometries.map((g) => g.geom)
    expect(unmarked.length).toBe(3)
    // Ink replaces a shallow body region and must not inflate the physical volume.
    expect(
      jscad.measurements.measureVolume(jscad.booleans.union(...solids)),
    ).toBeCloseTo(
      jscad.measurements.measureVolume(jscad.booleans.union(...unmarked)),
      5,
    )
  }
})
