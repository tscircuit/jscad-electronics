import { expect, test } from "bun:test"
import { createClampingShaftCollarMesh } from "../lib/models/clampingshaftcollar"
import {
  assertClosedShaftMount,
  containsMeshPoint,
  meshRayHits,
} from "./fixtures/assert-shaft-mount-geometry"
import { props } from "./fixtures/clamping-shaft-collar-case"

test("clampingshaftcollar: combined left-hand and fine-pitch threads retain a closed manifold exterior seam", () => {
  const result = createClampingShaftCollarMesh({
    ...props,
    threadHand: "left",
    threadPitch: 0.5,
  })
  assertClosedShaftMount(result)
  expect(meshRayHits(result, [6.5, -10, 4.5], [0, 1, 0])).toEqual([])
  expect(containsMeshPoint(result, [-6, 0, 4.5])).toBe(true)
})
