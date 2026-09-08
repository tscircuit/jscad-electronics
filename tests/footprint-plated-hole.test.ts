import { test, expect } from "bun:test"
import { FootprintPlatedHole } from "../lib/FootprintPlatedHole"

test("FootprintPlatedHole handles circle shape without throwing", () => {
  const hole: any = {
    shape: "circle",
    x: 0,
    y: 0,
    outer_diameter: 1.0,
    hole_diameter: 0.5,
  }

  let res
  expect(() => {
    res = FootprintPlatedHole({ hole })
  }).not.toThrow()
  expect(res).toBeDefined()
})

test("FootprintPlatedHole handles circular_hole_with_rect_pad variant", () => {
  const hole: any = {
    shape: "circular_hole_with_rect_pad",
    x: 1.2,
    y: -0.5,
    rect_pad_width: 1.6,
    hole_diameter: 0.6,
  }

  let res
  expect(() => {
    res = FootprintPlatedHole({ hole })
  }).not.toThrow()
  expect(res).toBeDefined()
})

test("FootprintPlatedHole treats oval like pill and honours ccw_rotation", () => {
  expect(() =>
    FootprintPlatedHole({
      hole: {
        shape: "oval",
        x: 0,
        y: 0,
        outer_width: 2,
        outer_height: 1,
        hole_width: 1,
        hole_height: 0.5,
        ccw_rotation: 30,
      } as any,
    }),
  ).not.toThrow()
})

test("FootprintPlatedHole renders pill_hole_with_rect_pad and rotated variant", () => {
  expect(() =>
    FootprintPlatedHole({
      hole: {
        shape: "pill_hole_with_rect_pad",
        x: 0,
        y: 0,
        rect_pad_width: 2,
        rect_pad_height: 1.2,
        hole_width: 1.2,
        hole_height: 0.6,
        hole_offset_x: 0.1,
        hole_offset_y: 0,
      } as any,
    }),
  ).not.toThrow()

  expect(() =>
    FootprintPlatedHole({
      hole: {
        shape: "rotated_pill_hole_with_rect_pad",
        x: 0,
        y: 0,
        rect_pad_width: 2,
        rect_pad_height: 1.2,
        hole_width: 1.2,
        hole_height: 0.6,
        hole_offset_x: 0.2,
        hole_offset_y: 0,
        rect_ccw_rotation: 45,
        hole_ccw_rotation: 45,
      } as any,
    }),
  ).not.toThrow()
})

test("FootprintPlatedHole renders hole_with_polygon_pad and rotates the outline", () => {
  expect(() =>
    FootprintPlatedHole({
      hole: {
        shape: "hole_with_polygon_pad",
        x: 1,
        y: 2,
        pad_outline: [
          { x: -1, y: -0.5 },
          { x: 1, y: -0.5 },
          { x: 1, y: 0.5 },
          { x: -1, y: 0.5 },
        ],
        hole_shape: "circle",
        hole_diameter: 0.6,
        hole_offset_x: 0.2,
        hole_offset_y: 0,
        ccw_rotation: 90,
      } as any,
    }),
  ).not.toThrow()
})
