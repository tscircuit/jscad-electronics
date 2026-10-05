import { expect, test } from "bun:test"
import { clampingShaftCollarModelPropsSchema } from "@tscircuit/modelprinter"
import { createClampingShaftCollarMesh } from "../lib/models/clampingshaftcollar"
import { createMountingHoleCutter } from "../lib/mechanical/shaft-mount-geometry"
import { props } from "./fixtures/clamping-shaft-collar-case"

test("clampingshaftcollar: schemas and renderer resolution guards reject invalid or unbounded work", () => {
  expect(() =>
    clampingShaftCollarModelPropsSchema.parse({
      ...props,
      width: 12,
      chamfer: 2.4999,
    }),
  ).not.toThrow()
  expect(() =>
    createClampingShaftCollarMesh({ ...props, boreDiameter: 100 }),
  ).toThrow()
  expect(() =>
    createClampingShaftCollarMesh({ ...props, width: 12, chamfer: 2.4999 }),
  ).toThrow("resolution limit")
  expect(() =>
    createClampingShaftCollarMesh({ ...props, threadPitch: 1e-9 }),
  ).toThrow("resolution limit")
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
