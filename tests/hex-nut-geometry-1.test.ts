import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  assertClosedGearMesh,
  meshBounds,
  sliceMesh,
  outerRadiusAtAngle,
  innerRadiusAtAngle,
  assertOpenAxialBore,
} from "./fixtures/assert-gear-geometry"
import { createHexNutMesh, createHexNutGeom } from "../lib/models/hexnut"
import { getHexNutDimensions } from "@tscircuit/modelprinter"

for (const metricSize of ["M5", "M6", "M8", "M10", "M12"] as const)
  test(`hex nut ${metricSize} has a manifold through bore and double chamfers`, () => {
    const input = { metricSize }
    const d = getHexNutDimensions(input)
    const mesh = createHexNutMesh(input, {
      radialSegments: 48,
      segmentsPerPitch: 16,
    })
    const volume = assertClosedGearMesh(mesh)
    assertOpenAxialBore(mesh, d.boreMinorDiameter / 2)
    const geom = createHexNutGeom(input, {
      radialSegments: 48,
      segmentsPerPitch: 16,
    })
    jscad.geometries.geom3.validate(geom)
    expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(volume, 6)
    const bounds = meshBounds(mesh)
    expect(bounds.minimum[2]).toBe(0)
    expect(bounds.maximum[2]).toBe(d.height)
    const middle = sliceMesh(mesh, d.height / 2)
    expect(outerRadiusAtAngle(middle, Math.PI / 2)).toBeCloseTo(
      d.acrossFlats / 2,
      6,
    )
    expect(outerRadiusAtAngle(middle, 0)).toBeCloseTo(d.acrossCorners / 2, 6)
    for (const angle of [
      0,
      Math.PI / 12,
      Math.PI / 6,
      Math.PI / 3 + Math.PI / 12,
    ]) {
      for (const fraction of [0.25, 0.5, 0.75]) {
        const z = d.outerChamferDepth * fraction
        const period = Math.PI / 3
        const offset =
          ((((angle - Math.PI / 2 + period / 2) % period) + period) % period) -
          period / 2
        const expected = Math.min(
          d.acrossFlats / 2 / Math.cos(offset),
          d.faceDiameter / 2 + z * Math.sqrt(3),
        )
        expect(outerRadiusAtAngle(sliceMesh(mesh, z), angle)).toBeCloseTo(
          expected,
          6,
        )
        expect(
          outerRadiusAtAngle(sliceMesh(mesh, d.height - z), angle),
        ).toBeCloseTo(expected, 6)
      }
    }
    const z = d.outerChamferDepth / 2
    expect(outerRadiusAtAngle(sliceMesh(mesh, z), 0)).toBeCloseTo(
      d.acrossFlats / 2 + z * Math.sqrt(3),
      6,
    )
    for (const at of [
      d.boreChamferDepth / 4,
      d.height - d.boreChamferDepth / 4,
    ])
      expect(innerRadiusAtAngle(sliceMesh(mesh, at), 0)).toBeCloseTo(
        d.mouthDiameter / 2 - Math.min(at, d.height - at),
        5,
      )
  })
