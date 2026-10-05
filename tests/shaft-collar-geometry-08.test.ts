import { expect, test } from "bun:test"
import {
  getShaftCollarDimensions,
  shaftCollarModelPropsSchema,
} from "@tscircuit/modelprinter"
import { createShaftCollarMesh } from "../lib/ShaftCollar"
import {
  assertClosedShaftMount,
  assertNoMountingEndCap,
  meshRayHits,
} from "./fixtures/assert-shaft-mount-geometry"
import { props } from "./fixtures/shaft-collar-case"

test("shaftcollar: a peripheral thread crest breaks fully into the faceted bore under pitch overrides", () => {
  const input = { ...props, threadPitch: 0.7257597415779593 }
  const result = createShaftCollarMesh(input)
  assertClosedShaftMount(result)
  const dimensions = getShaftCollarDimensions(
    shaftCollarModelPropsSchema.parse(input),
  )
  assertNoMountingEndCap(result, dimensions.screwHole)
  // The shaft fits at every tessellation angle, not only at the central hole ray.
  for (let i = 0; i < 128; i++) {
    const angle = (i * Math.PI * 2) / 128
    const hits = meshRayHits(
      result,
      [0, 0, 1],
      [Math.cos(angle), Math.sin(angle), 0],
    )
    expect(hits[0]!).toBeGreaterThanOrEqual(4 - 1e-6)
  }
})
