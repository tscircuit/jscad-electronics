import { expect, test } from "bun:test"
import { ExtrudedPads } from "../lib/ExtrudedPads"

test("ExtrudedPads renders rotated_rect, pill, oval, and polygon-pad holes", () => {
  expect(() =>
    ExtrudedPads({
      circuitJson: [
        {
          type: "pcb_smtpad",
          shape: "rotated_rect",
          x: 0,
          y: 0,
          width: 1.2,
          height: 0.6,
          ccw_rotation: 15,
          layer: "top",
        },
        {
          type: "pcb_smtpad",
          shape: "pill",
          x: 2,
          y: 0,
          width: 1.5,
          height: 0.6,
          radius: 0.3,
          layer: "top",
        },
        {
          type: "pcb_plated_hole",
          shape: "oval",
          x: 4,
          y: 0,
          outer_width: 1.8,
          outer_height: 0.9,
          hole_width: 1,
          hole_height: 0.5,
          ccw_rotation: 20,
          layers: ["top", "bottom"],
        },
        {
          type: "pcb_plated_hole",
          shape: "hole_with_polygon_pad",
          x: 6,
          y: 0,
          pad_outline: [
            { x: -0.8, y: -0.4 },
            { x: 0.8, y: -0.4 },
            { x: 0.8, y: 0.4 },
            { x: -0.8, y: 0.4 },
          ],
          hole_shape: "circle",
          hole_diameter: 0.5,
          ccw_rotation: 90,
          layers: ["top", "bottom"],
        },
      ] as any,
    }),
  ).not.toThrow()
})
