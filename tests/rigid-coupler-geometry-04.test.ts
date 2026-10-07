import { expect, test } from "bun:test"
import { createRigidCouplerMesh } from "../lib/models/rigidcoupler"
import {
  assertClosedShaftMount,
  containsMeshPoint,
} from "./fixtures/assert-shaft-mount-geometry"
import { props, mesh } from "./fixtures/rigid-coupler-case"

test("rigidcoupler: handed helical female threads alter the actual wall, not a color or label", () => {
  const right = mesh()
  const left = createRigidCouplerMesh({ ...props, threadHand: "left" })
  assertClosedShaftMount(left)
  // At depth 2.25 pitches, the +quarter-angle root is open on the right-hand
  // thread; its mirrored left-hand profile retains material at the same point.
  const point = [8.425, 1.82, 6.25] as const
  expect(containsMeshPoint(right, point)).toBe(false)
  expect(containsMeshPoint(left, point)).toBe(true)
})
