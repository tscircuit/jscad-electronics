import { test, expect } from "bun:test"
import * as jscad from "@jscad/modeling"
import { SOD323HE } from "../lib/SOD323HE"
import { sod323heVariants } from "../examples/fixtures/sod323he-variants"
import { getComponentModel } from "./helpers/component-model"
test("SOD323HE: dimension overrides change mold and terminal geometry", () => {
  for (const { props: p } of Object.values(sod323heVariants)) {
    const solids = getComponentModel(SOD323HE, p).geometries.map((g) => g.geom)
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
    const unmarked = getComponentModel(SOD323HE, {
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
