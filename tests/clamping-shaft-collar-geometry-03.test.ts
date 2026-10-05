import { expect, test } from "bun:test"
import { createClampingShaftCollarMesh } from "../lib/ClampingShaftCollar"
import {
  assertClosedShaftMount,
  containsMeshPoint,
  meshRayHits,
} from "./fixtures/assert-shaft-mount-geometry"
import {
  sliceMesh,
  innerRadiusAtAngle,
  outerRadiusAtAngle,
} from "./fixtures/assert-gear-geometry"
import { props } from "./fixtures/clamping-shaft-collar-case"

test("clampingshaftcollar: split, clamp coordinates, clearance and chamfers retain their fitting geometry", () => {
  const result = createClampingShaftCollarMesh({
    ...props,
    outerDiameter: 20,
    width: 10,
    splitWidth: 2,
    clampX: 7,
    screwZ: 6,
    clearanceHoleDiameter: 5,
    chamfer: 0.4,
  })
  assertClosedShaftMount(result)
  expect(meshRayHits(result, [7, -20, 6], [0, 1, 0])).toEqual([])
  expect(containsMeshPoint(result, [9.6, 0.9, 4])).toBe(false)
  const slice = sliceMesh(result, 0.1)
  expect(outerRadiusAtAngle(slice, Math.PI)).toBeCloseTo(9.7, 4)
  expect(innerRadiusAtAngle(slice, Math.PI)).toBeCloseTo(4.3, 4)
})
