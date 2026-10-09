import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getFemaleStandoffDimensions } from "@tscircuit/modelprinter"
import {
  createFemaleStandoffGeom,
  createFemaleStandoffMesh,
} from "../lib/models/femalestandoff"
import {
  assertClosedGearMesh,
  assertOpenAxialBore,
  meshBounds,
  sliceMesh,
  outerRadiusAtAngle,
  innerRadiusAtAngle,
} from "./fixtures/assert-gear-geometry"

for (const metricSize of ["M2", "M3", "M6", "M12"] as const)
  test(`female standoff ${metricSize} has a closed outward mesh, through bore and correct datums`, () => {
    const input = { metricSize }
    const dimensions = getFemaleStandoffDimensions(input)
    const mesh = createFemaleStandoffMesh(input)
    const volume = assertClosedGearMesh(mesh)
    assertOpenAxialBore(mesh, dimensions.boreMinorDiameter / 2)
    const geometry = createFemaleStandoffGeom(input)
    jscad.geometries.geom3.validate(geometry)
    expect(jscad.measurements.measureVolume(geometry)).toBeCloseTo(volume, 6)
    const bounds = meshBounds(mesh)
    expect(bounds.minimum[2]).toBe(0)
    expect(bounds.maximum[2]).toBe(dimensions.length)
    const middle = sliceMesh(mesh, dimensions.length / 2)
    expect(outerRadiusAtAngle(middle, Math.PI / 2)).toBeCloseTo(
      dimensions.acrossFlats / 2,
      6,
    )
    expect(outerRadiusAtAngle(middle, 0)).toBeCloseTo(
      dimensions.acrossCorners / 2,
      6,
    )
    for (const z of [
      dimensions.endChamfer / 2,
      dimensions.length - dimensions.endChamfer / 2,
    ]) {
      expect(outerRadiusAtAngle(sliceMesh(mesh, z), Math.PI / 2)).toBeCloseTo(
        (dimensions.acrossFlats - dimensions.endChamfer) / 2,
        6,
      )
      expect(innerRadiusAtAngle(sliceMesh(mesh, z), 0)).toBeCloseTo(
        dimensions.mouthDiameter / 2 - Math.min(z, dimensions.length - z),
        5,
      )
    }
  })

test("female standoff internal helix follows pitch and handedness", () => {
  const dimensions = getFemaleStandoffDimensions({})
  const z = 5.125
  const crest = (z * 2 * Math.PI) / dimensions.threadPitch
  const right = sliceMesh(createFemaleStandoffMesh({}), z)
  const left = sliceMesh(createFemaleStandoffMesh({ leftHand: true }), z)
  expect(innerRadiusAtAngle(right, crest)).toBeCloseTo(
    dimensions.boreMinorDiameter / 2,
    5,
  )
  expect(innerRadiusAtAngle(right, crest + Math.PI)).toBeCloseTo(
    dimensions.diameter / 2,
    4,
  )
  expect(innerRadiusAtAngle(left, -crest)).toBeCloseTo(
    dimensions.boreMinorDiameter / 2,
    5,
  )
  expect(innerRadiusAtAngle(left, crest)).toBeCloseTo(
    dimensions.diameter / 2,
    4,
  )
  const fine = createFemaleStandoffMesh({ threadPitch: 0.35, leftHand: true })
  assertClosedGearMesh(fine)
  const smooth = createFemaleStandoffMesh({ showThreads: false, endChamfer: 0 })
  assertClosedGearMesh(smooth)
  expect(smooth.indices.length).toBeLessThan(fine.indices.length / 5)
  expect(innerRadiusAtAngle(sliceMesh(smooth, 5), 0)).toBeCloseTo(
    dimensions.boreMinorDiameter / 2,
    6,
  )
})
test("female standoff validates schema and resolution before allocating mesh", () => {
  for (const props of [
    { acrossFlats: 3 },
    { length: 0 },
    { threadPitch: 2 },
    { endChamfer: 5 },
  ])
    expect(() => createFemaleStandoffMesh(props)).toThrow()
  for (const options of [
    { radialSegments: 25 },
    { radialSegments: 10000 },
    { radialSegments: NaN },
    { segmentsPerPitch: 0 },
    { segmentsPerPitch: 1000 },
  ])
    expect(() => createFemaleStandoffMesh({}, options)).toThrow(
      /resolution limit/i,
    )
  expect(() =>
    createFemaleStandoffMesh({ length: 1000, threadPitch: 0.01 }),
  ).toThrow(/resolution limit/i)
})
