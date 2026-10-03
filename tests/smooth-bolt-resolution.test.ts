import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  createHexSocketBoltGeom,
  createHexSocketBoltMesh,
} from "../lib/HexSocketBolt"

test("smooth NEMA screws keep exact shaft dimensions without thread-resolution faces", () => {
  const input = { metricSize: "M3" as const, length: 6, showThreads: false }
  const mesh = createHexSocketBoltMesh(input)
  expect(mesh.positions.length / 3).toBeLessThan(1200)
  const geometry = createHexSocketBoltGeom(input)
  const [min, max] = jscad.measurements.measureBoundingBox(geometry)
  expect(min[2]).toBe(-6)
  expect(max[2]).toBe(3)
  expect(max[0] - min[0]).toBeCloseTo(5.5)
  const levels = new Map<number, number[]>()
  for (let i = 0; i < mesh.positions.length; i += 3) {
    const z = mesh.positions[i + 2]!
    if (z > 0) continue
    const radii = levels.get(z) ?? []
    radii.push(Math.hypot(mesh.positions[i]!, mesh.positions[i + 1]!))
    levels.set(z, radii)
  }
  expect([...levels.keys()].filter((z) => z < 0)).toEqual([-6, -5.7])
  expect(Math.max(...levels.get(-6)!)).toBeCloseTo(1.2)
  expect(Math.max(...levels.get(-5.7)!)).toBeCloseTo(1.5)
  expect(jscad.measurements.measureVolume(geometry)).toBeGreaterThan(85)
})
