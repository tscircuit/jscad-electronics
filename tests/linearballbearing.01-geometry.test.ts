import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getLinearBallBearingDimensions } from "@tscircuit/modelprinter"
import {
  createLinearBallBearingMesh,
  createLinearBallBearingGeom,
} from "../lib/models/linearballbearing"
import { assertAssembly, rayHits } from "./fixtures/linearballbearing-geometry"
import { meshBounds } from "./fixtures/assert-gear-geometry"

test("linear bearing grooved sleeve, balls/return chambers, cage and retainers have closed clear surfaces", () => {
  for (const boreDiameter of [8, 10, 12]) {
    const input = { boreDiameter },
      d = getLinearBallBearingDimensions(input),
      mesh = createLinearBallBearingMesh(input)
    const volume = assertAssembly(mesh.parts)
    const bounds = meshBounds(mesh)
    expect(bounds.minimum[2]).toBe(0)
    expect(bounds.maximum[2]).toBe(d.length)
    expect(bounds.maximum[0]).toBe(d.outerRadius)
    expect(bounds.minimum[1]).toBeCloseTo(-d.outerRadius, 8)
    for (let i = 0; i < 24; i++) {
      const angle = (i * Math.PI) / 12
      expect(
        rayHits(
          mesh,
          [
            0.98 * d.boreRadius * Math.cos(angle),
            0.98 * d.boreRadius * Math.sin(angle),
            -1,
          ],
          [0, 0, 1],
        ),
      ).toBe(false)
    }
    expect(
      mesh.parts.filter((part) => part.name.startsWith("loaded row")),
    ).toHaveLength(6 * d.ballsPerRow)
    expect(
      mesh.parts.filter((part) => part.name.startsWith("return row")),
    ).toHaveLength(6 * d.ballsPerRow)
    expect(
      mesh.parts.filter((part) => part.name.startsWith("end-turn")),
    ).toHaveLength(12)
    expect(
      mesh.parts.filter((part) => part.name.startsWith("end retainer")),
    ).toHaveLength(2)
    const geom = createLinearBallBearingGeom(input)
    jscad.geometries.geom3.validate(geom)
    expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(volume, 6)
  }
})
