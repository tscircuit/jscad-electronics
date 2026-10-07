import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  createLeadScrewMesh,
  createLeadScrewGeom,
} from "../lib/models/leadscrew"
import {
  assertClosedGearMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"
test("lead screws remain watertight positive-volume solids with exact terminal datums", () => {
  for (const threadSize of ["TR8x2", "TR8x8(P2)"] as const) {
    const input = { threadSize, length: 12, chamfer: 0.5 }
    const mesh = createLeadScrewMesh(input, {
      radialSegments: 48,
      segmentsPerPitch: 12,
    })
    const volume = assertClosedGearMesh(mesh)
    const geom = createLeadScrewGeom(input, {
      radialSegments: 48,
      segmentsPerPitch: 12,
    })
    jscad.geometries.geom3.validate(geom)
    expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(volume, 6)
    const bounds = meshBounds(mesh)
    expect(bounds.minimum[2]).toBe(0)
    expect(bounds.maximum[2]).toBe(12)
    expect(bounds.maximumRadius).toBeCloseTo(4, 8)
    expect(volume).toBeGreaterThan(Math.PI * 2.75 ** 2 * 11)
    expect(volume).toBeLessThan(Math.PI * 4 ** 2 * 12)
    for (let i = 0; i < mesh.positions.length; i += 3)
      if (mesh.positions[i + 2] === 0 || mesh.positions[i + 2] === 12)
        expect(
          Math.hypot(mesh.positions[i]!, mesh.positions[i + 1]!),
        ).toBeLessThanOrEqual(3.5 + 1e-10)
  }
})
