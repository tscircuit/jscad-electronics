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
