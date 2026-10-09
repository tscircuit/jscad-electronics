import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getMaleFemaleStandoffDimensions } from "@tscircuit/modelprinter"
import {
  createMaleFemaleStandoffMesh,
  createMaleFemaleStandoffGeom,
} from "../lib/models/malefemalestandoff"
import {
  assertClosedGearMesh,
  meshBounds,
  sliceMesh,
  outerRadiusAtAngle,
  innerRadiusAtAngle,
} from "./fixtures/assert-gear-geometry"
const input = {
  metricSize: "M3",
  acrossFlats: 5.5,
  length: 10,
  studLength: 5,
  femaleDepth: 6,
} as const
const resolution = { radialSegments: 48, segmentsPerPitch: 16 }

test("male-female standoff is one outward manifold with independent shoulder, stud and blind socket datums", () => {
  const d = getMaleFemaleStandoffDimensions(input)
  const mesh = createMaleFemaleStandoffMesh(input, resolution)
  const volume = assertClosedGearMesh(mesh)
  const geom = createMaleFemaleStandoffGeom(input, resolution)
  jscad.geometries.geom3.validate(geom)
  expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(volume, 6)
  const bounds = meshBounds(mesh)
  expect(bounds.minimum[2]).toBe(-5)
  expect(bounds.maximum[2]).toBe(10)
  expect(bounds.maximumRadius).toBeCloseTo(d.acrossCorners / 2, 6)
  const body = sliceMesh(mesh, 3)
  expect(outerRadiusAtAngle(body, Math.PI / 2)).toBeCloseTo(2.75, 6)
  expect(outerRadiusAtAngle(body, 0)).toBeCloseTo(d.acrossCorners / 2, 6)
  // Below the blind floor the body is solid; above it there are two boundaries.
  expect(innerRadiusAtAngle(body, 0)).toBeCloseTo(
    outerRadiusAtAngle(body, 0),
    6,
  )
  expect(innerRadiusAtAngle(sliceMesh(mesh, 5), 0)).toBeLessThanOrEqual(
    d.diameter / 2,
  )
  const centers: number[] = []
  for (let i = 0; i < mesh.positions.length; i += 3)
    if (mesh.positions[i] === 0 && mesh.positions[i + 1] === 0)
      centers.push(mesh.positions[i + 2]!)
  expect(centers.sort((a, b) => a - b)).toEqual([-5, 4])
  const tipRadii = []
  for (let i = 0; i < mesh.positions.length; i += 3)
    if (mesh.positions[i + 2] === -5)
      tipRadii.push(Math.hypot(mesh.positions[i]!, mesh.positions[i + 1]!))
  expect(Math.max(...tipRadii)).toBeCloseTo(d.studTipDiameter / 2, 6)
})
test("male-female standoff threads share pitch and mirror handedness without changing mounting dimensions", () => {
  const right = createMaleFemaleStandoffMesh(input, resolution)
  const left = createMaleFemaleStandoffMesh(
    { ...input, leftHand: true },
    resolution,
  )
  assertClosedGearMesh(left)
  for (const z of [-2, -1.875, 5.125, 5.25])
    for (const angle of [Math.PI / 6, Math.PI / 2, Math.PI / 3]) {
      const outer = z < 0 ? outerRadiusAtAngle : innerRadiusAtAngle
      expect(outer(sliceMesh(right, z), angle)).toBeCloseTo(
        outer(sliceMesh(left, z), -angle),
        6,
      )
      expect(outer(sliceMesh(right, z), angle)).toBeCloseTo(
        outer(sliceMesh(right, z + 0.5), angle),
        6,
      )
    }
  const stud = sliceMesh(right, -2)
  expect(outerRadiusAtAngle(stud, 0)).toBeCloseTo(1.5, 6)
  expect(outerRadiusAtAngle(stud, Math.PI)).toBeCloseTo(
    getMaleFemaleStandoffDimensions(input).externalMinorDiameter / 2,
    6,
  )
  const bore = sliceMesh(right, 5)
  expect(innerRadiusAtAngle(bore, 0)).toBeCloseTo(
    getMaleFemaleStandoffDimensions(input).boreMinorDiameter / 2,
    6,
  )
  expect(innerRadiusAtAngle(bore, Math.PI)).toBeCloseTo(1.5, 6)
})
test("male-female standoff smooth and zero-chamfer variants preserve manifold geometry and socket depth", () => {
  const smooth = {
    ...input,
    showThreads: false,
    bodyChamfer: 0,
    studChamfer: 0,
    mouthChamfer: 0,
  }
  const mesh = createMaleFemaleStandoffMesh(smooth, resolution)
  assertClosedGearMesh(mesh)
  expect(outerRadiusAtAngle(sliceMesh(mesh, -2), Math.PI / 3)).toBeCloseTo(
    1.5,
    6,
  )
  expect(innerRadiusAtAngle(sliceMesh(mesh, 6), Math.PI / 3)).toBeCloseTo(
    getMaleFemaleStandoffDimensions(smooth).boreMinorDiameter / 2,
    6,
  )
  expect(meshBounds(mesh).minimum[2]).toBe(-5)
  expect(meshBounds(mesh).maximum[2]).toBe(10)
})
test("male-female standoff rejects invalid geometry contracts and unsafe tessellation budgets", () => {
  for (const extra of [
    { femaleDepth: 10 },
    { acrossFlats: 3 },
    { studLength: 0 },
    { threadPitch: 3 },
  ])
    expect(() => createMaleFemaleStandoffMesh({ ...input, ...extra })).toThrow()
  for (const options of [
    { radialSegments: 25 },
    { radialSegments: 0 },
    { radialSegments: Infinity },
    { segmentsPerPitch: 7 },
    { segmentsPerPitch: 65 },
    { segmentsPerPitch: NaN },
  ])
    expect(() => createMaleFemaleStandoffMesh(input, options)).toThrow(
      "resolution",
    )
  expect(() =>
    createMaleFemaleStandoffMesh(
      { ...input, threadPitch: 0.00001 },
      resolution,
    ),
  ).toThrow("resolution")
})
