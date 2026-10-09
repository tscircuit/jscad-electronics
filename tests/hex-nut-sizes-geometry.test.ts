import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  hexNutDinDimensions,
  hexNutImperialDimensions,
  getHexNutDimensions,
  type HexNutModelPropsInput,
} from "@tscircuit/modelprinter"
import { createHexNutMesh, createHexNutGeom } from "../lib/models/hexnut"
import {
  assertClosedGearMesh,
  assertOpenAxialBore,
  meshBounds,
  sliceMesh,
  innerRadiusAtAngle,
  outerRadiusAtAngle,
} from "./fixtures/assert-gear-geometry"

const sizes: HexNutModelPropsInput[] = [
  ...Object.keys(hexNutDinDimensions).map((metricSize) => ({
    standard: "din934" as const,
    metricSize: metricSize as keyof typeof hexNutDinDimensions,
  })),
  ...Object.keys(hexNutImperialDimensions).map((imperialSize) => ({
    imperialSize: imperialSize as keyof typeof hexNutImperialDimensions,
  })),
]
for (const input of sizes) {
  test(`hex nut ${input.metricSize ?? input.imperialSize} has a closed mesh and nominal envelope`, () => {
    const d = getHexNutDimensions(input)
    const options = { radialSegments: 48, segmentsPerPitch: 16 }
    const mesh = createHexNutMesh(input, options)
    const volume = assertClosedGearMesh(mesh)
    assertOpenAxialBore(mesh, d.boreMinorDiameter / 2)
    const geom = createHexNutGeom(input, options)
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
    // At a whole axial pitch the crest lies on +X; a quarter-pitch rise
    // moves it to +Y for a right-hand 60-degree internal thread.
    const z = d.threadPitch * Math.round(d.height / (2 * d.threadPitch))
    expect(innerRadiusAtAngle(sliceMesh(mesh, z), 0)).toBeCloseTo(
      d.boreMinorDiameter / 2,
      5,
    )
    expect(innerRadiusAtAngle(sliceMesh(mesh, z), Math.PI)).toBeCloseTo(
      d.diameter / 2,
      5,
    )
    expect(
      innerRadiusAtAngle(sliceMesh(mesh, z + d.threadPitch / 4), Math.PI / 2),
    ).toBeCloseTo(d.boreMinorDiameter / 2, 5)
    const smooth = createHexNutMesh({ ...input, showThreads: false }, options)
    assertClosedGearMesh(smooth)
    const bore = sliceMesh(smooth, d.height / 2)
    expect(innerRadiusAtAngle(bore, 0)).toBeCloseTo(d.boreMinorDiameter / 2, 6)
    expect(d.boreChamferDepth * 2).toBeLessThan(d.height)
    expect(d.outerChamferDepth * 2).toBeLessThan(d.height)
  })
}
