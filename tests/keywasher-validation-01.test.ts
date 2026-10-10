import { expect, test } from "bun:test"
import { createKeyWasherGeom } from "../lib/models/keywasher"
import { keyWasherProps } from "./fixtures/keywasher-example"
test("keywasher renderer rejects invalid material dimensions", () => {
  expect(() =>
    createKeyWasherGeom({ ...keyWasherProps, ...{ tabLength: 5 } }),
  ).toThrow()
  expect(() =>
    createKeyWasherGeom({ ...keyWasherProps, innerDiameter: Infinity }),
  ).toThrow()
})
