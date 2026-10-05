import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  assertClosedGearMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"
import {
  createThreadedRodMesh,
  createThreadedRodGeom,
} from "../lib/ThreadedRod"
import { getThreadedRodDimensions } from "@tscircuit/modelprinter"

for (const metricSize of ["M2.5", "M6", "M20"] as const)
  test(`threaded rod ${metricSize} keeps both end datums and 45-degree chamfers`, () => {
    const input = { metricSize, length: 10, chamfer: 0.3 }
    const d = getThreadedRodDimensions(input)
    const mesh = createThreadedRodMesh(input, {
      radialSegments: 48,
      segmentsPerPitch: 16,
    })
    const volume = assertClosedGearMesh(mesh)
    const geom = createThreadedRodGeom(input, {
      radialSegments: 48,
      segmentsPerPitch: 16,
    })
    jscad.geometries.geom3.validate(geom)
    expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(volume, 6)
    const bounds = meshBounds(mesh)
    expect(bounds.minimum[2]).toBe(0)
    expect(bounds.maximum[2]).toBe(10)
    expect(bounds.maximumRadius).toBeCloseTo(d.diameter / 2, 6)
    const endRadii = []
    for (let i = 0; i < mesh.positions.length; i += 3)
      if (mesh.positions[i + 2] === 0 || mesh.positions[i + 2] === 10)
        endRadii.push(Math.hypot(mesh.positions[i]!, mesh.positions[i + 1]!))
    expect(Math.max(...endRadii)).toBeLessThanOrEqual(d.endDiameter / 2 + 1e-10)
  })
