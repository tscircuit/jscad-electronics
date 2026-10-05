import { expect, test } from "bun:test"
import { createRigidCouplerMesh } from "../lib/models/rigidcoupler"
import {
  assertClosedShaftMount,
  containsMeshPoint,
} from "./fixtures/assert-shaft-mount-geometry"
import { props, mesh } from "./fixtures/rigid-coupler-case"

test("rigidcoupler: pitch overrides change the thread spacing within nominal diameter", () => {
  const fine = createRigidCouplerMesh({ ...props, threadPitch: 0.5 })
  assertClosedShaftMount(fine)
  const point = [8.6, 1.79, 6.25] as const
  expect(containsMeshPoint(mesh(), point)).toBe(false)
  expect(containsMeshPoint(fine, point)).toBe(true)
})
