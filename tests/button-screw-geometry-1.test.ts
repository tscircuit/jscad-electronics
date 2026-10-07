import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  assertClosedGearMesh,
  meshBounds,
  sliceMesh,
  outerRadiusAtAngle,
  innerRadiusAtAngle,
} from "./fixtures/assert-gear-geometry"
import {
  createButtonScrewMesh,
  createButtonScrewGeom,
} from "../lib/models/buttonscrew"
import { getButtonScrewDimensions } from "@tscircuit/modelprinter"

for (const metricSize of ["M3", "M4", "M5", "M6"] as const)
  test(`button screw ${metricSize} mesh is manifold with the exact dome and blind socket datums`, () => {
    const input = { metricSize, length: 10 }
    const d = getButtonScrewDimensions(input)
    const mesh = createButtonScrewMesh(input, {
      radialSegments: 48,
      segmentsPerPitch: 16,
    })
    const volume = assertClosedGearMesh(mesh)
    const geom = createButtonScrewGeom(input, {
      radialSegments: 48,
      segmentsPerPitch: 16,
    })
    jscad.geometries.geom3.validate(geom)
    expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(volume, 6)
    const bounds = meshBounds(mesh)
    expect(bounds.minimum[2]).toBe(-10)
    expect(bounds.maximum[2]).toBe(d.headHeight)
    expect(bounds.maximumRadius).toBeCloseTo(d.headDiameter / 2, 8)
    const socket = sliceMesh(mesh, d.topZ - d.socketDepth / 2)
    expect(innerRadiusAtAngle(socket, Math.PI / 2)).toBeCloseTo(
      d.socketWidth / 2,
      6,
    )
    expect(innerRadiusAtAngle(socket, 0)).toBeCloseTo(
      d.socketWidth / Math.sqrt(3),
      6,
    )
    const belowFloor = sliceMesh(mesh, d.topZ - d.socketDepth - 0.01)
    expect(innerRadiusAtAngle(belowFloor, 0)).toBeCloseTo(
      outerRadiusAtAngle(belowFloor, 0),
      6,
    )
    const centers = []
    for (let i = 0; i < mesh.positions.length; i += 3)
      if (mesh.positions[i] === 0 && mesh.positions[i + 1] === 0)
        centers.push(mesh.positions[i + 2])
    expect(centers).toEqual([-10, d.topZ - d.socketDepth])
    const crownZ = d.headHeight / 2
    expect(outerRadiusAtAngle(sliceMesh(mesh, crownZ), 0)).toBeCloseTo(
      d.crownArcCenterR +
        Math.sqrt(d.crownRadius ** 2 - (crownZ - d.crownArcCenterZ) ** 2),
      6,
    )
  })
