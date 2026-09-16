import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import {
  qfnCp2102_28BenchmarkFootprint,
  qfnCp2102_28Footprint,
} from "../examples/fixtures/qfn-cp2102-28"
import { importVanilla } from "./fixtures/importVanilla.js"

test("CP2102 QFN28 routes to its 5 x 5 x 0.6 mm molded outline", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  for (const footprint of [
    qfnCp2102_28Footprint,
    qfnCp2102_28BenchmarkFootprint,
  ]) {
    const solids = getJscadModelForFootprint(footprint, jscad).geometries
    const [lo, hi] = jscad.measurements.measureAggregateBoundingBox(
      ...solids.map(({ geom }: any) => geom),
    )
    expect(hi[0] - lo[0]).toBeCloseTo(5, 5)
    expect(hi[1] - lo[1]).toBeCloseTo(5, 5)
    expect(hi[2] - lo[2]).toBeCloseTo(0.6, 5)
  }
})
