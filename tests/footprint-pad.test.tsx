import { test, expect } from "bun:test"
import { FootprintPad } from "../lib/FootprintPad"

test("FootprintPad renders circular pad with explicit radius", () => {
  const pad: any = {
    shape: "circle",
    x: 1.5,
    y: -2.0,
    radius: 0.75,
  }

  const element: any = FootprintPad({ pad })
  expect(element).toBeDefined()
  const translate = element.props.children
  const cylinder = translate.props.children
  expect(cylinder.props.radius).toBe(0.75)
  expect(translate.props.offset).toEqual([1.5, -2.0, -0.005])
})

test("FootprintPad renders circular pad using 'r' property", () => {
  const pad: any = {
    shape: "circle",
    x: 0,
    y: 0,
    r: 0.4,
  }

  const element: any = FootprintPad({ pad })
  const translate = element.props.children
  const cylinder = translate.props.children
  expect(cylinder.props.radius).toBe(0.4)
})

test("FootprintPad falls back to default radius when neither radius nor r is provided", () => {
  const pad: any = {
    shape: "circle",
    x: 0,
    y: 0,
  }

  const element: any = FootprintPad({ pad })
  const translate = element.props.children
  const cylinder = translate.props.children
  expect(cylinder.props.radius).toBe(0.25)
})

test("FootprintPad renders pill and rotated_pill pads without throwing", () => {
  const pillPad: any = {
    shape: "pill",
    x: 1,
    y: 2,
    width: 1.6,
    height: 0.8,
  }
  const pillElement: any = FootprintPad({ pad: pillPad })
  expect(pillElement).toBeDefined()
  const pillTranslate = pillElement.props.children
  expect(pillTranslate.props.offset).toEqual([1, 2, -0.005])
  const pillRotate = pillTranslate.props.children
  expect(pillRotate.props.angles).toEqual([0, 0, 0])

  const rotatedPillPad: any = {
    shape: "rotated_pill",
    x: -1,
    y: 0.5,
    width: 1.6,
    height: 0.8,
    ccw_rotation: 90,
  }
  const rotatedElement: any = FootprintPad({ pad: rotatedPillPad })
  const rotatedRotate = rotatedElement.props.children.props.children
  expect(rotatedRotate.props.angles[2]).toBeCloseTo(Math.PI / 2, 6)
})
