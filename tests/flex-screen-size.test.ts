import { describe, expect, test } from "bun:test"
import { resolveFlexScreenSize } from "../lib/FlexScreen"

describe("resolveFlexScreenSize", () => {
  test("uses explicit width and height", () => {
    expect(resolveFlexScreenSize({ width: 40, height: 30 })).toMatchObject({
      width: 40,
      height: 30,
      diagonal: 50,
      aspectRatio: 4 / 3,
    })
  })

  test("derives dimensions from diagonal and a string ratio", () => {
    const size = resolveFlexScreenSize({ diagonal: 50, ratio: "4:3" })
    expect(size.width).toBeCloseTo(40)
    expect(size.height).toBeCloseTo(30)
  })

  test("derives the missing dimension from an explicit diagonal", () => {
    const size = resolveFlexScreenSize({ diagonal: 50, width: 40 })
    expect(size.height).toBeCloseTo(30)
    expect(size.aspectRatio).toBeCloseTo(4 / 3)
  })

  test("uses the default 16:9 ratio when only width is supplied", () => {
    const size = resolveFlexScreenSize({ width: 32 })
    expect(size.height).toBeCloseTo(18)
  })

  test("accepts a tuple ratio", () => {
    const size = resolveFlexScreenSize({ height: 20, aspectRatio: [3, 2] })
    expect(size.width).toBeCloseTo(30)
  })
})
