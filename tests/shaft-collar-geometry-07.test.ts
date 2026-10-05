import { expect, test } from "bun:test"
import { shaftCollarModelPropsSchema } from "@tscircuit/modelprinter"
import { createShaftCollarMesh } from "../lib/models/shaftcollar"
import { createMountingHoleCutter } from "../lib/mechanical/shaft-mount-geometry"
import { props } from "./fixtures/shaft-collar-case"

test("shaftcollar: schemas and renderer resolution guards reject invalid or unbounded work", () => {
  expect(() =>
    shaftCollarModelPropsSchema.parse({ ...props, boreDiameter: 15.999 }),
  ).not.toThrow()
  expect(() => createShaftCollarMesh({ ...props, boreDiameter: 100 })).toThrow()
  expect(() =>
    createShaftCollarMesh({ ...props, boreDiameter: 15.999 }),
  ).toThrow("resolution limit")
  expect(() => createShaftCollarMesh({ ...props, threadPitch: 1e-9 })).toThrow(
    "resolution limit",
  )
  expect(() =>
    createMountingHoleCutter({
      start: [0, 0, 0],
      direction: [1, 0, 0],
      diameter: 4,
      depth: 1e8,
      threadPitch: 0.7,
    }),
  ).toThrow("resolution limit")
})
