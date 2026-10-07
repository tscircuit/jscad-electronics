import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  ballBearingStandardSizes,
  getBallBearingDimensions,
} from "@tscircuit/modelprinter"
import {
  createBallBearingMesh,
  createBallBearingGeom,
} from "../lib/models/ballbearing"
import { assertAssembly, rayHits } from "./fixtures/ballbearing-geometry"
import { meshBounds } from "./fixtures/assert-gear-geometry"

test("radial bearing closed parts, outward winding, races/ball/cage clearance and open shaft", () => {
  for (const input of [
    ...Object.values(ballBearingStandardSizes),
    { innerDiameter: 6, outerDiameter: 20, width: 6 },
  ]) {
    const d = getBallBearingDimensions(input),
      mesh = createBallBearingMesh(input)
    const volume = assertAssembly(mesh.parts)
    const bounds = meshBounds(mesh)
    expect(bounds.minimum[2]).toBe(0)
    expect(bounds.maximum[2]).toBe(d.width)
    expect(bounds.minimum[0]).toBeCloseTo(-d.outerRadius, 8)
    expect(bounds.maximum[1]).toBeCloseTo(d.outerRadius, 8)
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI) / 8
      expect(
        rayHits(
          mesh,
          [
            d.boreRadius * 0.98 * Math.cos(angle),
            d.boreRadius * 0.98 * Math.sin(angle),
            -1,
          ],
          [0, 0, 1],
        ),
      ).toBe(false)
    }
    const balls = mesh.parts.filter((part) => part.center)
    expect(balls).toHaveLength(8)
    for (const ball of balls) {
      expect(Math.hypot(ball.center![0], ball.center![1])).toBeCloseTo(
        d.pitchRadius,
        8,
      )
      expect(ball.center![2]).toBe(d.width / 2)
    }
    const geom = createBallBearingGeom(input)
    jscad.geometries.geom3.validate(geom)
    expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(volume, 6)
  }
})
