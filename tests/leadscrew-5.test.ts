import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import type { AnyCircuitElement } from "circuit-json"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
test("leadscrew preserves explicit circuit JSON pads while rejecting invalid implicit models", () => {
  const invalid = "leadscrew_tr8x8(p2)_pitch8mm"
  expect(() => ExtrudedPads({ footprint: invalid })).toThrow()
  const circuitJson = [
    {
      type: "pcb_smtpad",
      pcb_smtpad_id: "lead-screw-pad",
      pcb_component_id: "lead-screw-board",
      shape: "rect",
      x: 4,
      y: -3,
      width: 2,
      height: 1,
      layer: "top",
      port_hints: ["1"],
    },
  ] as AnyCircuitElement[]
  const result = getComponentModel(ExtrudedPads, {
    footprint: invalid,
    circuitJson,
  })
  expect(result.geometries).toHaveLength(1)
  const solid = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
  expect(jscad.measurements.measureBoundingBox(solid)).toEqual([
    [3, -3.5, -0.01],
    [5, -2.5, 0],
  ])
  expect(
    getComponentModel(ExtrudedPads, { footprint: invalid, circuitJson: [] })
      .geometries,
  ).toHaveLength(0)
})
