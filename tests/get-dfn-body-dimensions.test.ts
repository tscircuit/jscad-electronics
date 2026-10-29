import { expect, test } from "bun:test"
import { getDfnBodyDimensions } from "../lib/utils/getDfnBodyDimensions"

test("DFN prefers authored mechanical body dimensions", () => {
  expect(
    getDfnBodyDimensions({
      w: 0.65,
      bodywidth: 0.65,
      bodylength: 0.4,
    }),
  ).toEqual({
    bodyWidth: 0.65,
    bodyLength: 0.4,
  })
})

test("DFN preserves legacy width and height dimensions", () => {
  expect(
    getDfnBodyDimensions({
      w: 2,
      h: 1.5,
    }),
  ).toEqual({
    bodyWidth: 2,
    bodyLength: 1.5,
  })
})
