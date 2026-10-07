import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getThrustBallBearingDimensions } from "@tscircuit/modelprinter"
import {
  createThrustBallBearingGeoms,
  createThrustBallBearingMesh,
  createThrustBallBearingMeshParts,
} from "../lib/models/thrustballbearing"
import {
  assertClosedGearMesh,
  assertOpenAxialBore,
  meshBounds,
} from "./fixtures/assert-gear-geometry"

test("thrust bearing parts are outward closed solids with exact mounting datums and through bore", () => {
  for (const [input, segments] of [
    [{}, 24],
    [{}, 96],
    [{ innerDiameter: 20, outerDiameter: 52, height: 12 }, 48],
  ] as const) {
    const d = getThrustBallBearingDimensions(input)
    const parts = createThrustBallBearingMeshParts(input, { segments })
    const geoms = createThrustBallBearingGeoms(input, { segments })
    expect(parts).toHaveLength(d.ballCount + 3)
    for (let i = 0; i < parts.length; i++) {
      const volume = assertClosedGearMesh(parts[i]!)
      jscad.geometries.geom3.validate(geoms[i]!)
      expect(jscad.measurements.measureVolume(geoms[i]!)).toBeCloseTo(volume, 6)
      assertOpenAxialBore(parts[i]!, d.innerRadius)
    }
    const combined = createThrustBallBearingMesh(input, { segments })
    const bounds = meshBounds(combined)
    expect(bounds.minimum).toEqual([-d.outerRadius, -d.outerRadius, 0])
    expect(bounds.maximum).toEqual([d.outerRadius, d.outerRadius, d.height])
    expect(meshBounds(parts[0]!).maximum[2]).toBeCloseTo(d.washerThickness, 8)
    expect(meshBounds(parts[1]!).minimum[2]).toBeCloseTo(
      d.height - d.washerThickness,
      8,
    )
  }
})
