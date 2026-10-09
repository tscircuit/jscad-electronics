import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getDowelPinDimensions } from "@tscircuit/modelprinter"
import { createDowelPinMesh, createDowelPinGeom } from "../lib/models/dowelpin"
import {
  assertClosedGearMesh,
  meshBounds,
  sliceMesh,
  outerRadiusAtAngle,
} from "./fixtures/assert-gear-geometry"
for (const diameter of [1, 3, 20])
  test(`dowel pin D${diameter} preserves overall length and the fixed 15-degree lead geometry`, () => {
    const input = { diameter, length: 40 }
    const d = getDowelPinDimensions(input)
    const radialSegments = 48
    const mesh = createDowelPinMesh(input, { radialSegments })
    const volume = assertClosedGearMesh(mesh)
    const geom = createDowelPinGeom(input, { radialSegments })
    jscad.geometries.geom3.validate(geom)
    expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(volume, 6)
    const bounds = meshBounds(mesh)
    expect(bounds.minimum[2]).toBe(0)
    expect(bounds.maximum[2]).toBe(40)
    expect(bounds.maximumRadius).toBeCloseTo(diameter / 2, 6)
    for (const fraction of [0.25, 0.5, 0.75]) {
      const z = d.endLeadLength * fraction
      const expected = d.endDiameter / 2 + z * Math.tan((15 * Math.PI) / 180)
      expect(outerRadiusAtAngle(sliceMesh(mesh, z), 0)).toBeCloseTo(expected, 6)
      expect(outerRadiusAtAngle(sliceMesh(mesh, 40 - z), 0)).toBeCloseTo(
        expected,
        6,
      )
    }
    expect(outerRadiusAtAngle(sliceMesh(mesh, 20), 0)).toBeCloseTo(
      diameter / 2,
      6,
    )
    const endRadii: number[] = []
    for (let i = 0; i < mesh.positions.length; i += 3)
      if (mesh.positions[i + 2] === 0 || mesh.positions[i + 2] === 40)
        endRadii.push(Math.hypot(mesh.positions[i]!, mesh.positions[i + 1]!))
    expect(Math.max(...endRadii)).toBeCloseTo(d.endDiameter / 2, 6)
    // Independent analytic cylinder plus two conical frustums, with polygon area correction.
    const r = diameter / 2,
      t = d.endDiameter / 2,
      c = d.endLeadLength
    const analytic =
      Math.PI * (r * r * (40 - 2 * c) + (2 * c * (r * r + r * t + t * t)) / 3)
    const polygonCorrection =
      (radialSegments * Math.sin((2 * Math.PI) / radialSegments)) /
      (2 * Math.PI)
    expect(volume).toBeCloseTo(analytic * polygonCorrection, 6)
  })
test("dowel pin mesh rejects contract conflicts and invalid tessellation", () => {
  for (const input of [
    { diameter: 3.5, length: 10 },
    { diameter: 3, length: 11 },
    { diameter: 20, length: 6 },
    { diameter: 3, length: 10, endLeadLength: 0.4 },
    { diameter: 3, length: 10, endLeadAngle: 45 },
  ])
    expect(() => createDowelPinMesh(input)).toThrow()
  for (const radialSegments of [0, 23, 25, 258, Infinity, NaN])
    expect(() =>
      createDowelPinMesh({ diameter: 3, length: 10 }, { radialSegments }),
    ).toThrow("resolution")
})
