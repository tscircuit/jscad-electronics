import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  createLeadScrewNutMesh,
  createLeadScrewNutGeom,
} from "../lib/models/leadscrewnut"
import {
  assertClosedGearMesh,
  assertOpenAxialBore,
  meshBounds,
} from "./fixtures/assert-gear-geometry"
test("nut meshes retain an open helical bore, flange shoulder and all terminal datums", () => {
  for (const style of ["flanged", "cylindrical"] as const)
    for (const threadSize of ["TR8x2", "TR8x8(P2)"] as const) {
      const input = { threadSize, style }
      const mesh = createLeadScrewNutMesh(input, {
        radialSegments: 48,
        segmentsPerPitch: 12,
        holeSegments: 24,
      })
      const volume = assertClosedGearMesh(mesh)
      assertOpenAxialBore(mesh, 3.05)
      const geom = createLeadScrewNutGeom(input, {
        radialSegments: 48,
        segmentsPerPitch: 12,
        holeSegments: 24,
      })
      jscad.geometries.geom3.validate(geom)
      expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(volume, 6)
      const bounds = meshBounds(mesh)
      expect(bounds.minimum[2]).toBe(0)
      expect(bounds.maximum[2]).toBe(15)
      expect(bounds.maximumRadius).toBeCloseTo(style === "flanged" ? 11 : 6, 8)
      expect(volume).toBeGreaterThan(Math.PI * (6 ** 2 - 4.55 ** 2) * 15)
      const top = mesh.positions.filter((_, i) => i % 3 === 2)
      expect(top.every((z) => z >= 0 && z <= 15)).toBe(true)
    }
})
