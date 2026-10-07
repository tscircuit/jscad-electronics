import { expect, test } from "bun:test"
import { createShaftCollarMesh } from "../lib/models/shaftcollar"
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
import { props, mesh } from "./fixtures/shaft-collar-case"

test("shaftcollar: dimensions, screw angle/Z, and real 45-degree entry chamfers drive the mesh", () => {
  const result = createShaftCollarMesh({
    ...props,
    outerDiameter: 18,
    width: 10,
    screwAngle: 90,
    screwZ: 6,
    chamfer: 0.4,
  })
  assertClosedShaftMount(result)
  expect(meshRayHits(result, [0, 0, 6], [0, 1, 0])).toEqual([])
  expect(containsMeshPoint(result, [0, 7, 4])).toBe(true)
  const slice = sliceMesh(result, 0.1)
  expect(outerRadiusAtAngle(slice, Math.PI)).toBeCloseTo(8.7, 4)
  expect(innerRadiusAtAngle(slice, Math.PI)).toBeCloseTo(4.3, 4)
})
