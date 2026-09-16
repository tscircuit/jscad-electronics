import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { smdPushbutton3p3Footprint } from "../examples/fixtures/smd-pushbutton-3p3"
import { importVanilla } from "./fixtures/importVanilla.js"

test("3.3 mm tactile footprint routes to aligned physical terminals", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const solids = getJscadModelForFootprint(
    smdPushbutton3p3Footprint,
    jscad,
  ).geometries
  const [lo, hi] = jscad.measurements.measureAggregateBoundingBox(
    ...solids.map(({ geom }: any) => geom),
  )
  expect(hi[0] - lo[0]).toBeCloseTo(4, 5)
  expect(hi[1] - lo[1]).toBeCloseTo(3.3, 5)
  expect(hi[2] - lo[2]).toBeCloseTo(1.5, 5)
  expect(solids).toHaveLength(6)

  type Bounds3d = [[number, number, number], [number, number, number]]
  const terminalBounds: Bounds3d[] = (solids as Array<{ geom: unknown }>)
    .slice(2)
    .map(
      ({ geom }) =>
        jscad.measurements.measureBoundingBox(geom as any) as Bounds3d,
    )
  const terminalCenters = terminalBounds.map(
    ([terminalLo, terminalHi]) =>
      [
        (terminalLo[0] + terminalHi[0]) / 2,
        (terminalLo[1] + terminalHi[1]) / 2,
      ] as const,
  )
  expect([
    ...new Set(terminalCenters.map(([x]) => Math.abs(x).toFixed(5))),
  ]).toEqual(["1.78000"])
  expect([
    ...new Set(terminalCenters.map(([, y]) => Math.abs(y).toFixed(5))),
  ]).toEqual(["1.00000"])
})
