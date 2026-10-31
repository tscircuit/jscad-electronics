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

test("FootprintPlatedHole handles rotated_pill and hole_offset on circular_hole_with_rect_pad", () => {
  const rotatedHole: any = {
    shape: "rotated_pill",
    x: 2.0,
    y: -1.0,
    outer_width: 2.2,
    outer_height: 1.2,
    hole_width: 1.4,
    hole_height: 0.7,
    ccw_rotation: 45,
  }
  const rotatedEl: any = FootprintPlatedHole({ hole: rotatedHole })
  expect(rotatedEl).toBeDefined()
  const rotateNode = rotatedEl.props.children.props.children
  expect(rotateNode.props.angles[2]).toBeCloseTo(Math.PI / 4, 6)

  const rectHole: any = {
    shape: "circular_hole_with_rect_pad",
    x: 0,
    y: 0,
    rect_pad_width: 1.8,
    hole_diameter: 0.8,
    hole_offset_x: 0.25,
    hole_offset_y: -0.15,
  }
  const rectEl: any = FootprintPlatedHole({ hole: rectHole })
  const subtractNode = rectEl.props.children.props.children
  const [padCuboid, holeCylinder] = subtractNode.props.children
  expect(padCuboid.props.size).toEqual([1.8, 1.8, 0.01])
  expect(holeCylinder.props.center).toEqual([0.25, -0.15, 0])
})
