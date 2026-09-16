import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import {
  qfnQfaa48BenchmarkFootprint,
  qfnQfaa48Footprint,
} from "../examples/fixtures/qfn-qfaa48"
import { importVanilla } from "./fixtures/importVanilla.js"

test("QFAA48 footprint routes to its 6 x 6 x 0.6 mm molded outline", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  for (const footprint of [qfnQfaa48Footprint, qfnQfaa48BenchmarkFootprint]) {
    const solids = getJscadModelForFootprint(footprint, jscad).geometries
    const [lo, hi] = jscad.measurements.measureAggregateBoundingBox(
      ...solids.map(({ geom }: any) => geom),
    )
    expect(hi[0] - lo[0]).toBeCloseTo(6, 5)
    expect(hi[1] - lo[1]).toBeCloseTo(6, 5)
    expect(hi[2] - lo[2]).toBeCloseTo(0.6, 5)
  }
})
