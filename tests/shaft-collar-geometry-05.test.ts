import { expect, test } from "bun:test"
import { createShaftCollarMesh } from "../lib/models/shaftcollar"
import {
  assertClosedShaftMount,
  containsMeshPoint,
} from "./fixtures/assert-shaft-mount-geometry"
import { props, mesh } from "./fixtures/shaft-collar-case"

test("shaftcollar: pitch overrides change the thread spacing within nominal diameter", () => {
  const fine = createShaftCollarMesh({ ...props, threadPitch: 0.5 })
  assertClosedShaftMount(fine)
  const point = [6.6, 1.79, 4] as const
  expect(containsMeshPoint(mesh(), point)).toBe(false)
  expect(containsMeshPoint(fine, point)).toBe(true)
})
