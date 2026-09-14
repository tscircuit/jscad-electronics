import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { fp } from "@tscircuit/footprinter"
import { SOT89 } from "../lib/SOT89"
import { sot89StandardVariants } from "../examples/fixtures/sot89-standard-variants"
import { getComponentModel } from "./helpers/component-model"
test("SOT89: dimensions, connected terminals and isolation", () => {
  const v = Object.values(sot89StandardVariants)[0]!,
    p = v.props
  const pads = fp
    .string(v.footprint)
    .circuitJson()
    .filter((p) => p.type === "pcb_smtpad")
  expect(pads.length).toBe(3)
  for (const pad of pads) expect(["rect", "polygon"]).toContain(pad.shape)
  const solids = getComponentModel(SOT89, p).geometries.map((g) => g.geom)
  expect(solids.length).toBe(4)
  const b = jscad.measurements.measureAggregateBoundingBox(...solids)
  for (const [i, v] of [4, 4.5, 1.5].entries())
    expect(b[1][i]! - b[0][i]!).toBeCloseTo(v, 5)
  expect(b[0][2]).toBeCloseTo(0, 6)
  for (let i = 1; i < solids.length; i++) {
    expect(jscad.measurements.measureVolume(solids[i]!)).toBeGreaterThan(0)
    expect(jscad.measurements.measureBoundingBox(solids[i]!)[0][2]).toBeCloseTo(
      0,
      6,
    )
    expect(
      jscad.measurements.measureVolume(
        jscad.booleans.intersect(solids[0]!, solids[i]!),
      ),
    ).toBeGreaterThan(0)
    for (let k = i + 1; k < solids.length; k++)
      expect(
        jscad.measurements.measureVolume(
          jscad.booleans.intersect(solids[i]!, solids[k]!),
        ),
      ).toBeCloseTo(0, 8)
  }
  expect(() => SOT89({ ...p, bodyHeight: NaN })).toThrow()
  expect(() => SOT89({ ...p, ...{ tabWidth: 4 } })).toThrow()
})
