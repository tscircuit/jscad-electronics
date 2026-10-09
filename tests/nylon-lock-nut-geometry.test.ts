import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getNylonLockNutDimensions, mp } from "@tscircuit/modelprinter"
import {
  createNylonLockNutGeom,
  createNylonLockNutGeometries,
  createNylonLockNutMesh,
  createNylonLockNutMeshes,
} from "../lib/models/nylonlocknut"
import {
  assertClosedGearMesh,
  assertOpenAxialBore,
  innerRadiusAtAngle,
  meshBounds,
  outerRadiusAtAngle,
  sliceMesh,
} from "./fixtures/assert-gear-geometry"

for (const metricSize of ["M5", "M6", "M8", "M10", "M12"] as const)
  test(`nylon lock nut ${metricSize} assembly and both materials are closed, outward and dimensioned`, () => {
    const input = { metricSize },
      resolution = { radialSegments: 48, segmentsPerPitch: 16 }
    const d = getNylonLockNutDimensions(input)
    const mesh = createNylonLockNutMesh(input, resolution)
    const parts = createNylonLockNutMeshes(input, resolution)
    const volume = assertClosedGearMesh(mesh)
    const metalVolume = assertClosedGearMesh(parts.metal),
      insertVolume = assertClosedGearMesh(parts.insert)
    expect(volume).toBeCloseTo(metalVolume + insertVolume, 7)
    assertOpenAxialBore(mesh, d.boreMinorDiameter / 2)
    expect(meshBounds(mesh).minimum[2]).toBe(0)
    expect(meshBounds(mesh).maximum[2]).toBe(d.height)
    expect(meshBounds(parts.insert).minimum[2]).toBe(d.insertBottomZ)
    expect(meshBounds(parts.insert).maximum[2]).toBe(d.insertTopZ)
    const body = sliceMesh(mesh, d.bodyHeight / 2)
    expect(outerRadiusAtAngle(body, Math.PI / 2)).toBeCloseTo(
      d.acrossFlats / 2,
      7,
    )
    expect(outerRadiusAtAngle(body, 0)).toBeCloseTo(d.acrossCorners / 2, 7)
    const at = (d.insertBottomZ + d.insertTopZ) / 2
    expect(innerRadiusAtAngle(sliceMesh(parts.metal, at), 0)).toBeCloseTo(
      d.pocketDiameter / 2,
      7,
    )
    expect(outerRadiusAtAngle(sliceMesh(parts.insert, at), 0)).toBeCloseTo(
      d.pocketDiameter / 2,
      7,
    )
    expect(innerRadiusAtAngle(sliceMesh(mesh, at), 0)).toBeCloseTo(
      d.insertBoreDiameter / 2,
      7,
    )
    const geom = createNylonLockNutGeom(input, resolution)
    const geometries = createNylonLockNutGeometries(input, resolution)
    for (const solid of [geom, geometries.metal, geometries.insert])
      jscad.geometries.geom3.validate(solid)
    expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(volume, 6)
    expect(jscad.measurements.measureVolume(geometries.insert)).toBeCloseTo(
      insertVolume,
      6,
    )
  })

test("nylon lock nut thread visibility changes metal grooves while preserving the locking insert", () => {
  const input = { metricSize: "M6" as const },
    d = getNylonLockNutDimensions(input)
  const visible = createNylonLockNutMeshes(input),
    smooth = createNylonLockNutMeshes({ ...input, showThreads: false })
  expect(visible.insert).toEqual(smooth.insert)
  expect(visible.metal.positions.length).toBeGreaterThan(
    smooth.metal.positions.length,
  )
  expect(
    innerRadiusAtAngle(sliceMesh(smooth.metal, d.bodyHeight / 2), 0),
  ).toBeCloseTo(d.boreMinorDiameter / 2, 7)
  for (const resolution of [
    { radialSegments: 25 },
    { radialSegments: 0 },
    { segmentsPerPitch: 1 },
    { segmentsPerPitch: Infinity },
  ])
    expect(() => createNylonLockNutMesh(input, resolution)).toThrow(
      "resolution",
    )
  expect(() =>
    createNylonLockNutMesh({ metricSize: "M6", threadPitch: 0.75 }),
  ).toThrow()
})

test("nylon lock nut omitted and explicit ISO flags produce identical material meshes", () => {
  const resolution = { radialSegments: 48, segmentsPerPitch: 16 }
  const implicit = mp.string("nylonlocknut_m6").json()
  const explicit = mp.string("nylonlocknut_m6_ISO7040").json()
  if (implicit.fn !== "nylonlocknut" || explicit.fn !== "nylonlocknut")
    throw new Error("Unexpected model")
  const { fn: implicitFn, ...implicitProps } = implicit
  const { fn: explicitFn, ...explicitProps } = explicit
  expect(createNylonLockNutMesh(explicitProps, resolution)).toEqual(
    createNylonLockNutMesh(implicitProps, resolution),
  )
  expect(createNylonLockNutMeshes(explicitProps, resolution)).toEqual(
    createNylonLockNutMeshes(implicitProps, resolution),
  )
})
