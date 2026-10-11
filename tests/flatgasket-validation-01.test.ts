import { expect, test } from "bun:test"
import { createFlatGasketGeom } from "../lib/models/flatgasket"
import { flatGasketProps } from "./fixtures/flatgasket-example"
test("flatgasket renderer rejects invalid material dimensions", () => {
  expect(() =>
    createFlatGasketGeom({ ...flatGasketProps, ...{ innerDiameter: 35 } }),
  ).toThrow()
  expect(() =>
    createFlatGasketGeom({ ...flatGasketProps, innerDiameter: Infinity }),
  ).toThrow()
})
