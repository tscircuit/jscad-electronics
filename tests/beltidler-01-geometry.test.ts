import { expect, test } from "bun:test"
import { getBeltIdlerDimensions } from "@tscircuit/modelprinter"
import { createBeltIdlerMesh } from "../lib/models/beltidler"
import {
  assertClosedGearMesh,
  assertOpenAxialBore,
  meshBounds,
  sliceMesh,
  outerRadiusAtAngle,
  innerRadiusAtAngle,
} from "./fixtures/assert-gear-geometry"
test("beltidler smooth contact, two retaining flanges, through bore, datums and resolution", () => {
  for (const radialSegments of [32, 128, 512]) {
    const p = {
      outerDiameter: 20,
      boreDiameter: 5,
      beltWidth: 10,
      beltThickness: 2.2,
      sideClearance: 1,
      flangeHeight: 3,
      flangeThickness: 1,
    }
    const d = getBeltIdlerDimensions(p),
      mesh = createBeltIdlerMesh(p, { radialSegments })
    const volume = assertClosedGearMesh(mesh)
    assertOpenAxialBore(mesh, 2.5)
    const ideal =
      Math.PI * ((10 ** 2 - 2.5 ** 2) * 12 + 2 * (13 ** 2 - 2.5 ** 2))
    expect(volume).toBeCloseTo(
      (ideal * Math.sin((2 * Math.PI) / radialSegments)) /
        ((2 * Math.PI) / radialSegments),
      8,
    )
    expect(meshBounds(mesh).minimum).toEqual([-13, -13, -1])
    expect(meshBounds(mesh).maximum).toEqual([13, 13, 13])
    const body = sliceMesh(mesh, 6),
      bottom = sliceMesh(mesh, -0.5),
      top = sliceMesh(mesh, 12.5)
    for (let i = 0; i < radialSegments; i++) {
      const a = (2 * Math.PI * i) / radialSegments
      expect(outerRadiusAtAngle(body, a)).toBeCloseTo(10, 9)
      expect(outerRadiusAtAngle(bottom, a)).toBeCloseTo(13, 9)
      expect(outerRadiusAtAngle(top, a)).toBeCloseTo(13, 9)
      expect(innerRadiusAtAngle(body, a)).toBeCloseTo(2.5, 9)
    }
    expect(d.faceWidth - p.beltWidth).toBe(2 * p.sideClearance)
    expect(d.flangeAboveBelt).toBeGreaterThan(0)
  }
  for (const radialSegments of [0, 16, 33, 513, 64.5, NaN])
    expect(() => createBeltIdlerMesh({}, { radialSegments })).toThrow(
      "radialSegments",
    )
  expect(() => createBeltIdlerMesh({ boreDiameter: 20 })).toThrow()
  expect(() => createBeltIdlerMesh({ flangeHeight: 2.2 })).toThrow()
  expect(() => createBeltIdlerMesh({ sideClearance: 1e-9 })).toThrow(
    "numerical",
  )
})
