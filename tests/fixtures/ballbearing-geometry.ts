import { expect } from "bun:test"
import { assertClosedGearMesh } from "./assert-gear-geometry"

type Point = [number, number, number]
type Mesh = { positions: number[]; indices: number[] }
type Part = { name: string; mesh: Mesh; center?: Point; radius?: number }
const subtract = (a: Point, b: Point): Point => [
  a[0] - b[0],
  a[1] - b[1],
  a[2] - b[2],
]
const dot = (a: Point, b: Point) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a: Point, b: Point): Point => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
]
const at = (mesh: Mesh, i: number): Point => [
  mesh.positions[3 * i]!,
  mesh.positions[3 * i + 1]!,
  mesh.positions[3 * i + 2]!,
]

// Closest point on a triangle, including edge and vertex Voronoi regions.
function pointTriangleDistance(p: Point, a: Point, b: Point, c: Point) {
  const ab = subtract(b, a),
    ac = subtract(c, a),
    ap = subtract(p, a)
  const d1 = dot(ab, ap),
    d2 = dot(ac, ap)
  if (d1 <= 0 && d2 <= 0) return Math.hypot(...ap)
  const bp = subtract(p, b),
    d3 = dot(ab, bp),
    d4 = dot(ac, bp)
  if (d3 >= 0 && d4 <= d3) return Math.hypot(...bp)
  const vc = d1 * d4 - d3 * d2
  if (vc <= 0 && d1 >= 0 && d3 <= 0) {
    const v = d1 / (d1 - d3)
    return Math.hypot(
      ...subtract(p, [a[0] + v * ab[0], a[1] + v * ab[1], a[2] + v * ab[2]]),
    )
  }
  const cp = subtract(p, c),
    d5 = dot(ab, cp),
    d6 = dot(ac, cp)
  if (d6 >= 0 && d5 <= d6) return Math.hypot(...cp)
  const vb = d5 * d2 - d1 * d6
  if (vb <= 0 && d2 >= 0 && d6 <= 0) {
    const w = d2 / (d2 - d6)
    return Math.hypot(
      ...subtract(p, [a[0] + w * ac[0], a[1] + w * ac[1], a[2] + w * ac[2]]),
    )
  }
  const va = d3 * d6 - d5 * d4
  if (va <= 0 && d4 - d3 >= 0 && d5 - d6 >= 0) {
    const w = (d4 - d3) / (d4 - d3 + d5 - d6),
      bc = subtract(c, b)
    return Math.hypot(
      ...subtract(p, [b[0] + w * bc[0], b[1] + w * bc[1], b[2] + w * bc[2]]),
    )
  }
  const normal = cross(ab, ac)
  return Math.abs(dot(ap, normal)) / Math.hypot(...normal)
}
export function assertAssembly(parts: Part[]) {
  let volume = 0
  for (const part of parts) {
    const partVolume = assertClosedGearMesh(part.mesh)
    volume += partVolume
    if (part.radius !== undefined) {
      const sphereVolume = (4 / 3) * Math.PI * part.radius ** 3
      expect(partVolume / sphereVolume).toBeGreaterThan(0.96)
      expect(partVolume / sphereVolume).toBeLessThan(1)
    }
  }
  const balls = parts.filter((part) => part.center !== undefined)
  const walls = parts.filter((part) => part.center === undefined)
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i]!
    for (const other of balls.slice(i + 1))
      expect(
        Math.hypot(...subtract(ball.center!, other.center!)) + 1e-9,
      ).toBeGreaterThanOrEqual(ball.radius! + other.radius!)
    for (const wall of walls) {
      let distance = Infinity
      for (let j = 0; j < wall.mesh.indices.length; j += 3)
        distance = Math.min(
          distance,
          pointTriangleDistance(
            ball.center!,
            at(wall.mesh, wall.mesh.indices[j]!),
            at(wall.mesh, wall.mesh.indices[j + 1]!),
            at(wall.mesh, wall.mesh.indices[j + 2]!),
          ),
        )
      if (distance + 1e-8 < ball.radius!)
        throw new Error(
          `${ball.name} intersects ${wall.name}: sphere radius ${ball.radius}, surface distance ${distance}`,
        )
    }
  }
  return volume
}

/** Any hit is material crossing the requested through-hole ray. */
export function rayHits(mesh: Mesh, origin: Point, direction: Point) {
  for (let i = 0; i < mesh.indices.length; i += 3) {
    const a = at(mesh, mesh.indices[i]!),
      b = at(mesh, mesh.indices[i + 1]!),
      c = at(mesh, mesh.indices[i + 2]!)
    const ab = subtract(b, a),
      ac = subtract(c, a),
      p = cross(direction, ac),
      denominator = dot(ab, p)
    if (Math.abs(denominator) < 1e-10) continue
    const t = subtract(origin, a),
      u = dot(t, p) / denominator
    if (u < -1e-9 || u > 1 + 1e-9) continue
    const q = cross(t, ab),
      v = dot(direction, q) / denominator
    if (v < -1e-9 || u + v > 1 + 1e-9) continue
    if (dot(ac, q) / denominator > 1e-9) return true
  }
  return false
}
