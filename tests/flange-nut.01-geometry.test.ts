import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  flangeNutDimensions,
  getFlangeNutDimensions,
} from "@tscircuit/modelprinter"
import {
  createFlangeNutGeom,
  createFlangeNutMesh,
} from "../lib/models/flangenut"
import {
  assertClosedShaftMount,
  meshRayHits,
} from "./fixtures/assert-shaft-mount-geometry"
import { flangeNutProps } from "./fixtures/flange-nut-case"

for (const metricSize of Object.keys(
  flangeNutDimensions,
) as (keyof typeof flangeNutDimensions)[]) {
  test(`flange nut ${metricSize} is one closed outward solid with an open bore`, () => {
    const d = getFlangeNutDimensions({ metricSize })
    let threadedVolume = 0
    for (const showThreads of [true, false]) {
      const options = { radialSegments: 48, segmentsPerPitch: 16 }
      const mesh = createFlangeNutMesh({ metricSize, showThreads }, options)
      const volume = assertClosedShaftMount(mesh)
      if (showThreads) threadedVolume = volume
      else expect(volume).toBeGreaterThan(threadedVolume)
      const z = mesh.positions.filter((_, i) => i % 3 === 2)
      expect(Math.min(...z)).toBe(0)
      expect(Math.max(...z)).toBe(d.height)
      expect(meshRayHits(mesh, [0, 0, -1], [0, 0, 1])).toEqual([])
      const geometry = createFlangeNutGeom({ metricSize, showThreads }, options)
      jscad.geometries.geom3.validate(geometry)
      expect(jscad.measurements.measureVolume(geometry)).toBeCloseTo(volume, 7)
      const box = jscad.measurements.measureBoundingBox(geometry)
      expect(box[0]).toEqual([-d.flangeDiameter / 2, -d.flangeDiameter / 2, 0])
      expect(box[1]).toEqual([
        d.flangeDiameter / 2,
        d.flangeDiameter / 2,
        d.height,
      ])
    }
  })
}

test("independent M6 rays verify flange envelope, flat bearing and upper chamfer", () => {
  const mesh = createFlangeNutMesh(flangeNutProps)
  assertClosedShaftMount(mesh)
  const radius = (z: number, angle = 0) =>
    meshRayHits(mesh, [0, 0, z], [Math.cos(angle), Math.sin(angle), 0]).at(-1)!
  expect(radius(0.5)).toBeCloseTo(7.1, 8)
  expect(radius(1.5, Math.PI / 2)).toBeCloseTo(
    7.1 - 0.4 / Math.tan((20 * Math.PI) / 180),
    8,
  )
  expect(radius(3)).toBeCloseTo(10 / Math.sqrt(3), 8)
  expect(radius(3, Math.PI / 2)).toBeCloseTo(5, 8)
  expect(radius(5.9)).toBeCloseTo(5 + 0.1 * Math.sqrt(3), 8)
  expect(meshRayHits(mesh, [6.5, 0, -1], [0, 0, 1])[0]).toBeCloseTo(1, 8)
  expect(meshRayHits(mesh, [3.2, 0, -1], [0, 0, 1])[0]).toBeCloseTo(1.175, 8)
})

test("M6 bore probes distinguish basic crest, root, coarse pitch and right hand", () => {
  const mesh = createFlangeNutMesh(flangeNutProps)
  const radius = (z: number, angle = 0) =>
    meshRayHits(mesh, [0, 0, z], [Math.cos(angle), Math.sin(angle), 0])[0]!
  const minor = (6 - (5 * Math.sqrt(3)) / 8) / 2
  expect(radius(2.125)).toBeCloseTo(minor, 8)
  expect(radius(2.5)).toBeCloseTo(3, 8)
  expect(radius(3.125)).toBeCloseTo(radius(2.125), 8)
  expect(radius(2.25, Math.PI / 2)).toBeCloseTo(minor, 8)
  expect(radius(2.25)).toBeCloseTo(minor + Math.sqrt(3) / 8, 8)
  expect(radius(0.25)).toBeCloseTo(3.375 - 0.25, 8)
  expect(radius(5.75)).toBeCloseTo(3.375 - 0.25, 8)
  const smooth = createFlangeNutMesh({ ...flangeNutProps, showThreads: false })
  for (const z of [2.125, 2.25, 2.5, 3.125])
    expect(meshRayHits(smooth, [0, 0, z], [1, 0, 0])[0]).toBeCloseTo(minor, 8)
})

test("renderer consumes schema validation and rejects invalid tessellation", () => {
  for (const props of [
    { metricSize: "M6", threadPitch: 0.75 },
    { metricSize: "M6", plainFace: false },
    { metricSize: "M6", height: 6 },
    { metricSize: "M7" },
  ])
    expect(() => createFlangeNutMesh(props as never)).toThrow()
  for (const options of [
    { radialSegments: 25 },
    { radialSegments: 12 },
    { radialSegments: 204 },
    { radialSegments: NaN },
    { radialSegments: 96.5 },
    { segmentsPerPitch: 0 },
    { segmentsPerPitch: 65 },
    { segmentsPerPitch: Infinity },
  ])
    expect(() => createFlangeNutMesh(flangeNutProps, options)).toThrow()
  for (const radialSegments of [24, 192])
    assertClosedShaftMount(
      createFlangeNutMesh(flangeNutProps, {
        radialSegments,
        segmentsPerPitch: 8,
      }),
    )
})
