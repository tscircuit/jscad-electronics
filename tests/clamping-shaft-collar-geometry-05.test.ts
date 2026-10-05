import { expect, test } from "bun:test"
import { createClampingShaftCollarMesh } from "../lib/ClampingShaftCollar"
import {
  assertClosedShaftMount,
  containsMeshPoint,
} from "./fixtures/assert-shaft-mount-geometry"
import { props, mesh } from "./fixtures/clamping-shaft-collar-case"

test("clampingshaftcollar: pitch overrides change the thread spacing within nominal diameter", () => {
  const fine = createClampingShaftCollarMesh({ ...props, threadPitch: 0.5 })
  assertClosedShaftMount(fine)
  const point = [8.29, 1.9, 4.5] as const
  expect(containsMeshPoint(mesh(), point)).toBe(false)
  expect(containsMeshPoint(fine, point)).toBe(true)
})
