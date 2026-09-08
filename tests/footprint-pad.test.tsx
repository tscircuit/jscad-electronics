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

const collectRotations = (node: any, out: any[] = []): any[] => {
  if (!node || typeof node !== "object") return out
  if (node.props?.rotation) out.push(node.props.rotation)
  const children = node.props?.children
  if (Array.isArray(children)) {
    for (const child of children) collectRotations(child, out)
  } else if (children) {
    collectRotations(children, out)
  }
  return out
}

test("FootprintPad renders rotated_rect instead of throwing", () => {
  const pad: any = {
    shape: "rotated_rect",
    x: 1.5,
    y: -2,
    width: 2,
    height: 0.8,
    ccw_rotation: 45,
  }

  let element: any
  expect(() => {
    element = FootprintPad({ pad })
  }).not.toThrow()
  expect(element).toBeDefined()
  expect(collectRotations(element)).toContainEqual([0, 0, "45deg"])
})

test("FootprintPad renders pill and rotated_pill pads", () => {
  expect(() =>
    FootprintPad({
      pad: {
        shape: "pill",
        x: 0,
        y: 0,
        width: 2,
        height: 0.8,
        radius: 0.4,
      } as any,
    }),
  ).not.toThrow()

  const rotated: any = FootprintPad({
    pad: {
      shape: "rotated_pill",
      x: 0,
      y: 0,
      width: 2,
      height: 0.8,
      radius: 0.4,
      ccw_rotation: 90,
    } as any,
  })
  expect(collectRotations(rotated)).toContainEqual([0, 0, "90deg"])
})
