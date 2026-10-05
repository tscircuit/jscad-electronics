import { expect, test } from "bun:test"
import { rigidCouplerModelPropsSchema } from "@tscircuit/modelprinter"
import { createRigidCouplerMesh } from "../lib/RigidCoupler"
import { createMountingHoleCutter } from "../lib/mechanical/shaft-mount-geometry"
import { props } from "./fixtures/rigid-coupler-case"

test("rigidcoupler: schemas and renderer resolution guards reject invalid or unbounded work", () => {
  const thin = { ...props, boreDiameter: 19.999, boreBDiameter: 19.999 }
  expect(() => rigidCouplerModelPropsSchema.parse(thin)).not.toThrow()
  expect(() => createRigidCouplerMesh(thin)).toThrow("resolution limit")
  expect(() =>
    createRigidCouplerMesh({ ...props, boreDiameter: 100 }),
  ).toThrow()
  expect(() => createRigidCouplerMesh({ ...props, threadPitch: 1e-9 })).toThrow(
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
