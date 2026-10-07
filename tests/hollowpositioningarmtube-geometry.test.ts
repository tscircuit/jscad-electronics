import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  getHollowPositioningArmTubeDimensions,
  getHollowPositioningArmTubeFrame,
  hollowPositioningArmTubeModelPropsSchema,
  type HollowPositioningArmTubeModelPropsInput,
} from "@tscircuit/modelprinter"
import { Triangle, Vector3 } from "three"
import {
  createHollowPositioningArmTubeGeom,
  createHollowPositioningArmTubeMesh,
} from "../lib/models/hollowpositioningarmtube"
import {
  assertClosedGearMesh,
  innerRadiusAtAngle,
  outerRadiusAtAngle,
  sliceMesh,
} from "./fixtures/assert-gear-geometry"

for (const [name, input] of [
  ["lamp bend", {}],
  ["straight ribbed", { bendAngle: 0, startLength: 15, endLength: 0 }],
  [
    "smooth U bend",
    {
      outerDiameter: 8,
      innerDiameter: 5,
      startLength: 20,
      endLength: 20,
      bendRadius: 30,
      bendAngle: 180,
      ribDepth: 0,
    },
  ],
  [
    "pure bend in inches",
    {
      outerDiameter: "0.25in",
      innerDiameter: "0.125in",
      startLength: 0,
      endLength: 0,
      bendRadius: "1in",
      bendAngle: 45,
    },
  ],
  [
    "tight bend",
    { startLength: 0, endLength: 0, bendRadius: 3.1, bendAngle: 180 },
  ],
] satisfies [string, HollowPositioningArmTubeModelPropsInput][]) {
  test(`hollowpositioningarmtube ${name}: closed outward mesh and clear wire passage`, () => {
    const props = hollowPositioningArmTubeModelPropsSchema.parse(input)
    const mesh = createHollowPositioningArmTubeMesh(input)
    const volume = assertClosedGearMesh(mesh)
    const geometry = createHollowPositioningArmTubeGeom(input)
    jscad.geometries.geom3.validate(geometry)
    expect(jscad.measurements.measureVolume(geometry)).toBeCloseTo(volume, 6)

    // Distance to triangle interiors catches caps across the bore, not only
    // vertices. Sample both mounting ends, tangent joins and the entire bend.
    const { totalLength, bendLength } =
      getHollowPositioningArmTubeDimensions(input)
    const distances = [
      0,
      props.startLength,
      props.startLength + bendLength,
      totalLength,
    ]
    for (let i = 1; i < 40; i++) distances.push((totalLength * i) / 40)
    const triangle = new Triangle()
    const nearest = new Vector3()
    for (const s of distances) {
      const center = new Vector3(
        ...getHollowPositioningArmTubeFrame(input, s).position,
      )
      let clearance = Infinity
      for (let i = 0; i < mesh.indices.length; i += 3) {
        triangle.a.fromArray(mesh.positions, mesh.indices[i]! * 3)
        triangle.b.fromArray(mesh.positions, mesh.indices[i + 1]! * 3)
        triangle.c.fromArray(mesh.positions, mesh.indices[i + 2]! * 3)
        triangle.closestPointToPoint(center, nearest)
        clearance = Math.min(clearance, center.distanceTo(nearest))
      }
      expect(clearance).toBeGreaterThan((props.innerDiameter / 2) * 0.97)
    }
  }, 30000)
}

test("hollowpositioningarmtube straight section has the requested bore, rib crests and roots", () => {
  const mesh = createHollowPositioningArmTubeMesh({
    bendAngle: 0,
    startLength: 9,
    endLength: 0,
  })
  // Quarter-period is between root and crest; avoid slicing on a mesh ring.
  for (const [s, outside] of [
    [2.25 * 0.001, 2.75],
    [2.25 * 0.499, 3],
  ] as const) {
    const slice = sliceMesh(mesh, s)
    expect(outerRadiusAtAngle(slice, 0)).toBeCloseTo(outside, 2)
    expect(innerRadiusAtAngle(slice, 0)).toBeCloseTo(2, 8)
  }
  const z = mesh.positions.filter((_, i) => i % 3 === 2)
  expect(Math.min(...z)).toBe(0)
  expect(Math.max(...z)).toBe(9)
})

test("hollowpositioningarmtube smooth tube volume matches the nominal annulus along the path", () => {
  const props = { ribDepth: 0 }
  const volume = jscad.measurements.measureVolume(
    createHollowPositioningArmTubeGeom(props),
  )
  const nominal =
    Math.PI *
    (3 ** 2 - 2 ** 2) *
    getHollowPositioningArmTubeDimensions(props).totalLength
  // A 24-sided section loses 1.14% of circular area; bound the additional
  // centerline tessellation error within a 2% total volume tolerance.
  expect(volume / nominal).toBeGreaterThan(0.98)
  expect(volume / nominal).toBeLessThanOrEqual(1)
})

test("hollowpositioningarmtube guards resolution, impossible geometry and excessive work", () => {
  for (const options of [
    { radialSegments: 0 },
    { radialSegments: 15 },
    { radialSegments: 132 },
    { segmentsPerRib: 2 },
    { segmentsPerRib: 6 },
    { segmentsPerRib: Infinity },
  ])
    expect(() => createHollowPositioningArmTubeMesh({}, options)).toThrow()
  for (const props of [
    { ribPitch: 1e-9 },
    { bendRadius: 2 },
    { innerDiameter: 5.5 },
    { outerDiameter: Infinity },
    { ribDepth: 0, innerDiameter: 6 - 1e-12 },
    { startLength: 1e-12, endLength: 0, bendAngle: 0, ribDepth: 0 },
  ])
    expect(() => createHollowPositioningArmTubeMesh(props)).toThrow()
  // A smooth tube does not depend on pitch, even if s / pitch overflows.
  expect(
    createHollowPositioningArmTubeMesh({
      ribDepth: 0,
      ribPitch: 1e-310,
    }).positions.every(Number.isFinite),
  ).toBe(true)
})
