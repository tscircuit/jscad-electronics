import { expect, test } from "bun:test"
import { createRectangularGasketGeom } from "../lib/models/rectangulargasket"
import { rectangularGasketProps } from "./fixtures/rectangulargasket-example"
test("rectangulargasket renderer rejects invalid material dimensions", () => {
  expect(() =>
    createRectangularGasketGeom({
      ...rectangularGasketProps,
      ...{ border: 25 },
    }),
  ).toThrow()
  expect(() =>
    createRectangularGasketGeom({ ...rectangularGasketProps, width: Infinity }),
  ).toThrow()
})
