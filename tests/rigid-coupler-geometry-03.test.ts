import { expect, test } from "bun:test"
import { createRigidCouplerMesh } from "../lib/RigidCoupler"
import {
  assertClosedShaftMount,
  containsMeshPoint,
  meshRayHits,
} from "./fixtures/assert-shaft-mount-geometry"
import { sliceMesh, innerRadiusAtAngle } from "./fixtures/assert-gear-geometry"
import { props } from "./fixtures/rigid-coupler-case"

test("rigidcoupler: unequal bores have a sharp midpoint shoulder and explicit rotated hole positions", () => {
  const result = createRigidCouplerMesh({
    ...props,
    boreBDiameter: 10,
    screwEndOffset: 5,
    screwAngle: 45,
    chamfer: 0.4,
  })
  assertClosedShaftMount(result)
  const axis = [Math.SQRT1_2, Math.SQRT1_2, 0] as const
  expect(meshRayHits(result, [0, 0, 5], axis)).toEqual([])
  expect(meshRayHits(result, [0, 0, 20], axis)).toEqual([])
  expect(containsMeshPoint(result, [0, 4.5, 12])).toBe(true)
  expect(containsMeshPoint(result, [0, 4.5, 13])).toBe(false)
  expect(innerRadiusAtAngle(sliceMesh(result, 0.1), Math.PI)).toBeCloseTo(
    4.3,
    4,
  )
  expect(innerRadiusAtAngle(sliceMesh(result, 24.9), Math.PI)).toBeCloseTo(
    5.3,
    4,
  )
})
