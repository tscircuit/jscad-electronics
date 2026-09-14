import { test, expect } from "bun:test"
import * as jscad from "@jscad/modeling"
import { DFN } from "../lib/dfn"
import { dfnVariants } from "../examples/fixtures/dfn-variants"
import { getComponentModel } from "./helpers/component-model"

test("DFN dimensions, lead setback, pin-1 chamfers and multi-pin variants", () => {
  const cases = [
    ...Object.values(dfnVariants).map((v) => v.props),
    {
      num_pins: 6,
      bodyStyle: "rectangular" as const,
      bodyWidth: 2,
      bodyLength: 1.6,
      bodyThickness: 0.5,
      padLength: 0.4,
      padWidth: 0.3,
      pitch: 0.5,
      standoff: 0.03,
      terminalInset: 0.1,
      terminalThickness: 0.08,
      pin1MarkWidth: 0,
    },
  ]
  for (const props of cases) {
    const solids = getComponentModel(DFN, props).geometries.map((g) => g.geom)
    const bounds = jscad.measurements.measureAggregateBoundingBox(...solids)
    expect(bounds[0][2]).toBeCloseTo(0, 5)
    for (const [i, expected] of [
      props.bodyWidth,
      props.bodyLength,
      props.bodyThickness + props.standoff,
    ].entries())
      expect(bounds[1][i]! - bounds[0][i]!).toBeCloseTo(expected, 5)
    expect(solids.length).toBe(
      1 + props.num_pins + (props.pin1MarkWidth > 0 ? 1 : 0),
    )
    const terminal = jscad.measurements.measureBoundingBox(solids[1]!)
    expect(terminal[0][0]).toBeCloseTo(
      -props.bodyWidth / 2 + props.terminalInset,
      5,
    )
    expect(terminal[1][2]).toBeCloseTo(props.terminalThickness, 5)
    for (const lead of solids.slice(1, props.num_pins + 1))
      expect(
        jscad.measurements.measureVolume(
          jscad.booleans.intersect(solids[0]!, lead),
        ),
      ).toBeGreaterThan(0)
  }
  const base = cases[0]!
  for (const override of [
    { num_pins: 3 },
    { bodyWidth: NaN },
    { standoff: 0.1 },
    { terminalInset: -0.1 },
    { pin1TerminalChamfer: 0.3 },
  ])
    expect(() => DFN({ ...base, ...override })).toThrow()
  // The optional terminal chamfer actually removes material, not just a label.
  const uncut = getComponentModel(DFN, { ...cases[1]!, pin1TerminalChamfer: 0 })
    .geometries[1]!.geom
  const cut = getComponentModel(DFN, cases[1]!).geometries[1]!.geom
  expect(
    jscad.measurements.measureVolume(uncut) -
      jscad.measurements.measureVolume(cut),
  ).toBeCloseTo(0.05 * 0.05 * 0.05, 7)
})
