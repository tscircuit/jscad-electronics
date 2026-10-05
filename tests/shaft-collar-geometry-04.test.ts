import { expect, test } from "bun:test"
import { createShaftCollarMesh } from "../lib/ShaftCollar"
import {
  assertClosedShaftMount,
  containsMeshPoint,
} from "./fixtures/assert-shaft-mount-geometry"
import { props, mesh } from "./fixtures/shaft-collar-case"

test("shaftcollar: handed helical female threads alter the actual wall, not a color or label", () => {
  const right = mesh()
  const left = createShaftCollarMesh({ ...props, threadHand: "left" })
  assertClosedShaftMount(left)
  // At depth 2.25 pitches, the +quarter-angle root is open on the right-hand
  // thread; its mirrored left-hand profile retains material at the same point.
  const point = [6.425, 1.82, 4] as const
  expect(containsMeshPoint(right, point)).toBe(false)
  expect(containsMeshPoint(left, point)).toBe(true)
})
