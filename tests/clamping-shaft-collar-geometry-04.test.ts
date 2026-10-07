import { expect, test } from "bun:test"
import { createClampingShaftCollarMesh } from "../lib/models/clampingshaftcollar"
import {
  assertClosedShaftMount,
  containsMeshPoint,
} from "./fixtures/assert-shaft-mount-geometry"
import { props, mesh } from "./fixtures/clamping-shaft-collar-case"

test("clampingshaftcollar: handed helical female threads alter the actual wall, not a color or label", () => {
  const right = mesh()
  const left = createClampingShaftCollarMesh({ ...props, threadHand: "left" })
  assertClosedShaftMount(left)
  // At depth 2.25 pitches, the +quarter-angle root is open on the right-hand
  // thread; its mirrored left-hand profile retains material at the same point.
  const point = [8.32, 2.075, 4.5] as const
  expect(containsMeshPoint(right, point)).toBe(false)
  expect(containsMeshPoint(left, point)).toBe(true)
})
