import { expect, test } from "bun:test"
import { createCornerFootGeom } from "../lib/models/cornerfoot"
import { cornerFootProps } from "./fixtures/cornerfoot-example"
test("cornerfoot renderer rejects invalid material dimensions", () => {
  expect(() =>
    createCornerFootGeom({ ...cornerFootProps, ...{ holeDiameter: 20 } }),
  ).toThrow()
  expect(() =>
    createCornerFootGeom({ ...cornerFootProps, width: Infinity }),
  ).toThrow()
})
