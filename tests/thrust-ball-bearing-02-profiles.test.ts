import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getThrustBallBearingDimensions } from "@tscircuit/modelprinter"
import {
  createThrustBallBearingGeoms,
  createThrustBallBearingMeshParts,
} from "../lib/models/thrustballbearing"
import { meshBounds } from "./fixtures/assert-gear-geometry"

test("thrust race circles, ball centers and true cage pockets agree with nominal dimensions", () => {
  const d = getThrustBallBearingDimensions()
  for (const segments of [24, 96]) {
    const parts = createThrustBallBearingMeshParts({}, { segments })
    const geoms = createThrustBallBearingGeoms({}, { segments })
    const lower = parts[0]!
    const groovePoints = []
    for (let i = 0; i < lower.positions.length; i += 3) {
      const x = lower.positions[i]!
      const y = lower.positions[i + 1]!
      const z = lower.positions[i + 2]!
      if (
        x > 0 &&
        Math.abs(y) < 1e-8 &&
        x > d.pitchRadius - d.grooveHalfWidth - 1e-8 &&
        x < d.pitchRadius + d.grooveHalfWidth + 1e-8 &&
        z > 0
      ) {
        groovePoints.push([x, z])
        expect(Math.hypot(x - d.pitchRadius, z - d.ballCenterZ)).toBeCloseTo(
          d.grooveRadius,
          8,
        )
      }
    }
    expect(groovePoints).toHaveLength(25)
    expect(Math.min(...groovePoints.map(([, z]) => z!))).toBeCloseTo(
      d.ballCenterZ - d.grooveRadius,
      8,
    )
    const q = d.ballRadius * 0.82
    const removedGrooveVolume =
      2 *
      Math.PI *
      d.pitchRadius *
      (d.grooveRadius ** 2 * Math.asin(d.grooveHalfWidth / d.grooveRadius) -
        d.grooveHalfWidth * q)
    const washerVolume =
      Math.PI * (d.outerRadius ** 2 - d.innerRadius ** 2) * d.washerThickness -
      removedGrooveVolume
    const angularFactor =
      Math.sin((2 * Math.PI) / segments) / ((2 * Math.PI) / segments)
    expect(
      Math.abs(
        jscad.measurements.measureVolume(geoms[0]!) /
          (washerVolume * angularFactor) -
          1,
      ),
    ).toBeLessThan(0.0003)
    expect(jscad.measurements.measureVolume(geoms[0]!)).toBeCloseTo(
      jscad.measurements.measureVolume(geoms[1]!),
      7,
    )
    const polygonArea = (r: number, n: number) =>
      (n * r * r * Math.sin((2 * Math.PI) / n)) / 2
    const pocketSegments = Math.max(12, segments / 4)
    const cageVolume =
      (polygonArea(d.cageOuterRadius, segments) -
        polygonArea(d.cageInnerRadius, segments) -
        d.ballCount * polygonArea(d.cagePocketRadius, pocketSegments)) *
      d.cageThickness
    expect(jscad.measurements.measureVolume(geoms[2]!)).toBeCloseTo(
      cageVolume,
      7,
    )
    expect(
      d.cagePocketRadius * Math.cos(Math.PI / pocketSegments),
    ).toBeGreaterThan(d.ballRadius)
    for (let i = 0; i < d.ballCount; i++) {
      const angle = (i * Math.PI * 2) / d.ballCount
      const center = [
        d.pitchRadius * Math.cos(angle),
        d.pitchRadius * Math.sin(angle),
        d.ballCenterZ,
      ]
      const ball = parts[3 + i]!
      for (let j = 0; j < ball.positions.length; j += 3)
        expect(
          Math.hypot(
            ball.positions[j]! - center[0]!,
            ball.positions[j + 1]! - center[1]!,
            ball.positions[j + 2]! - center[2]!,
          ),
        ).toBeCloseTo(d.ballRadius, 8)
      const bounds = meshBounds(ball)
      expect(bounds.minimum[2]).toBeCloseTo(d.ballCenterZ - d.ballRadius, 8)
      expect(bounds.maximum[2]).toBeCloseTo(d.ballCenterZ + d.ballRadius, 8)
      const volumeRatio =
        jscad.measurements.measureVolume(geoms[3 + i]!) /
        ((4 * Math.PI * d.ballRadius ** 3) / 3)
      expect(volumeRatio).toBeGreaterThan(0.97)
      expect(volumeRatio).toBeLessThan(1)
    }
  }
})
