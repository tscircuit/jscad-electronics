import { expect } from "bun:test"

type Point2 = [number, number]
type Point3 = [number, number, number]

export type GearMesh = { positions: number[]; indices: number[] }
export type SliceSegment = [Point2, Point2]

const cross2 = (a: Point2, b: Point2) => a[0] * b[1] - a[1] * b[0]
const subtract2 = (a: Point2, b: Point2): Point2 => [a[0] - b[0], a[1] - b[1]]
const vertex = (mesh: GearMesh, index: number): Point3 => [
  mesh.positions[3 * index]!,
  mesh.positions[3 * index + 1]!,
  mesh.positions[3 * index + 2]!,
]

/** Check topology and winding on the raw mesh, before JSCAD can repair it. */
export function assertClosedGearMesh(mesh: GearMesh) {
  expect(mesh.positions.length % 3).toBe(0)
  expect(mesh.indices.length % 3).toBe(0)
  expect(mesh.indices.length).toBeGreaterThan(0)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  const vertexCount = mesh.positions.length / 3
  const edges = new Map<string, { count: number; winding: number }>()
  const referenced = new Set<number>()
  let volume = 0
  for (let i = 0; i < mesh.indices.length; i += 3) {
    const triangle = mesh.indices.slice(i, i + 3)
    for (const index of triangle) {
      expect(Number.isInteger(index)).toBe(true)
      expect(index).toBeGreaterThanOrEqual(0)
      expect(index).toBeLessThan(vertexCount)
      referenced.add(index)
    }
    const [a, b, c] = triangle.map((index) => vertex(mesh, index)) as [
      Point3,
      Point3,
      Point3,
    ]
    const ab = b.map((value, axis) => value - a[axis]!)
    const ac = c.map((value, axis) => value - a[axis]!)
    const normal = [
      ab[1]! * ac[2]! - ab[2]! * ac[1]!,
      ab[2]! * ac[0]! - ab[0]! * ac[2]!,
      ab[0]! * ac[1]! - ab[1]! * ac[0]!,
    ]
    expect(Math.hypot(...normal)).toBeGreaterThan(1e-10)
    volume +=
      (a[0] * (b[1] * c[2] - b[2] * c[1]) +
        a[1] * (b[2] * c[0] - b[0] * c[2]) +
        a[2] * (b[0] * c[1] - b[1] * c[0])) /
      6
    for (let edge = 0; edge < 3; edge++) {
      const from = triangle[edge]!
      const to = triangle[(edge + 1) % 3]!
      const key = `${Math.min(from, to)},${Math.max(from, to)}`
      const prior = edges.get(key) ?? { count: 0, winding: 0 }
      prior.count++
      prior.winding += from < to ? 1 : -1
      edges.set(key, prior)
    }
  }
  expect(referenced.size).toBe(vertexCount)
  for (const edge of edges.values()) {
    expect(edge.count).toBe(2)
    expect(edge.winding).toBe(0)
  }
  expect(Number.isFinite(volume)).toBe(true)
  expect(volume).toBeGreaterThan(0)
  return volume
}

/** Triangle/plane intersections avoid assuming how the mesh sampled the profile. */
export function sliceMesh(mesh: GearMesh, z: number): SliceSegment[] {
  const result: SliceSegment[] = []
  for (let i = 0; i < mesh.indices.length; i += 3) {
    const points = mesh.indices
      .slice(i, i + 3)
      .map((index) => vertex(mesh, index))
    const intersections: Point2[] = []
    for (let edge = 0; edge < 3; edge++) {
      const a = points[edge]!
      const b = points[(edge + 1) % 3]!
      if (a[2] < z === b[2] < z) continue
      const fraction = (z - a[2]) / (b[2] - a[2])
      intersections.push([
        a[0] + fraction * (b[0] - a[0]),
        a[1] + fraction * (b[1] - a[1]),
      ])
    }
    if (intersections.length === 2)
      result.push([intersections[0]!, intersections[1]!])
  }
  expect(result.length).toBeGreaterThan(0)
  return result
}

export function outerRadiusAtAngle(slice: SliceSegment[], angle: number) {
  const direction: Point2 = [Math.cos(angle), Math.sin(angle)]
  let radius = 0
  for (const [a, b] of slice) {
    const edge = subtract2(b, a)
    const denominator = cross2(direction, edge)
    if (Math.abs(denominator) < 1e-12) continue
    const alongEdge = cross2(a, direction) / denominator
    const alongRay = cross2(a, edge) / denominator
    if (alongEdge >= -1e-9 && alongEdge <= 1 + 1e-9 && alongRay > radius)
      radius = alongRay
  }
  return radius
}

export function innerRadiusAtAngle(slice: SliceSegment[], angle: number) {
  const direction: Point2 = [Math.cos(angle), Math.sin(angle)]
  let radius = Infinity
  for (const [a, b] of slice) {
    const edge = subtract2(b, a)
    const denominator = cross2(direction, edge)
    if (Math.abs(denominator) < 1e-12) continue
    const alongEdge = cross2(a, direction) / denominator
    const alongRay = cross2(a, edge) / denominator
    if (alongEdge >= -1e-9 && alongEdge <= 1 + 1e-9 && alongRay > 0)
      radius = Math.min(radius, alongRay)
  }
  return radius
}

/** Measure occupied arcs at a chosen circle, independently of tooth vertices. */
export function materialArcsAtRadius(slice: SliceSegment[], radius: number) {
  const tau = 2 * Math.PI
  const angles: number[] = []
  for (const [a, b] of slice) {
    const edge = subtract2(b, a)
    const aa = edge[0] ** 2 + edge[1] ** 2
    if (aa < 1e-20) continue
    const bb = 2 * (a[0] * edge[0] + a[1] * edge[1])
    const cc = a[0] ** 2 + a[1] ** 2 - radius ** 2
    const discriminant = bb ** 2 - 4 * aa * cc
    if (discriminant <= 1e-16) continue
    for (const t of [
      (-bb - Math.sqrt(discriminant)) / (2 * aa),
      (-bb + Math.sqrt(discriminant)) / (2 * aa),
    ]) {
      if (t < -1e-9 || t > 1 + 1e-9) continue
      const angle = Math.atan2(a[1] + t * edge[1], a[0] + t * edge[0])
      angles.push((angle + tau) % tau)
    }
  }
  angles.sort((a, b) => a - b)
  const unique = angles.filter(
    (angle, index) => index === 0 || angle - angles[index - 1]! > 1e-8,
  )
  const arcs: {
    start: number
    end: number
    midpoint: number
    width: number
  }[] = []
  for (let i = 0; i < unique.length; i++) {
    const start = unique[i]!
    const end =
      unique[(i + 1) % unique.length]! + (i === unique.length - 1 ? tau : 0)
    const midpoint = (start + end) / 2
    if (outerRadiusAtAngle(slice, midpoint) > radius)
      arcs.push({ start, end, midpoint: midpoint % tau, width: end - start })
  }
  return arcs
}

const distanceToSegment = (a: Point2, b: Point2) => {
  const edge = subtract2(b, a)
  const t = Math.max(
    0,
    Math.min(
      1,
      -(a[0] * edge[0] + a[1] * edge[1]) / (edge[0] ** 2 + edge[1] ** 2 || 1),
    ),
  )
  return Math.hypot(a[0] + t * edge[0], a[1] + t * edge[1])
}

/** A cap triangle crossing the axis fails even if all its vertices miss the hole. */
export function assertOpenAxialBore(mesh: GearMesh, radius: number) {
  for (let i = 0; i < mesh.indices.length; i += 3) {
    const projected = mesh.indices
      .slice(i, i + 3)
      .map((index) => vertex(mesh, index).slice(0, 2) as Point2)
    const signs = projected.map((a, index) =>
      cross2(a, projected[(index + 1) % 3]!),
    )
    const enclosesOrigin =
      signs.every((sign) => sign > 1e-10) ||
      signs.every((sign) => sign < -1e-10)
    expect(enclosesOrigin).toBe(false)
    const nearest = Math.min(
      ...projected.map((a, index) =>
        distanceToSegment(a, projected[(index + 1) % 3]!),
      ),
    )
    // Circular bores use chords; allow their tessellation sagitta, not solid caps.
    expect(nearest).toBeGreaterThan(radius * 0.97)
  }
}

/** Minimum radial distance of exterior side triangles, including their interiors. */
export function minimumOuterWallRadius(mesh: GearMesh, boreRadius: number) {
  let minimum = Infinity
  for (let i = 0; i < mesh.indices.length; i += 3) {
    const points = mesh.indices
      .slice(i, i + 3)
      .map((index) => vertex(mesh, index))
    if (points.every((point) => point[2] === points[0]![2])) continue
    if (
      points.every(
        (point) => Math.abs(Math.hypot(point[0], point[1]) - boreRadius) < 1e-8,
      )
    )
      continue
    const projected = points.map((point) => [point[0], point[1]] as Point2)
    const signs = projected.map((a, index) =>
      cross2(a, projected[(index + 1) % 3]!),
    )
    if (
      signs.every((sign) => sign > 1e-10) ||
      signs.every((sign) => sign < -1e-10)
    )
      return 0
    minimum = Math.min(
      minimum,
      ...projected.map((a, index) =>
        distanceToSegment(a, projected[(index + 1) % 3]!),
      ),
    )
  }
  return minimum
}

export function meshBounds(mesh: GearMesh) {
  const minimum = [Infinity, Infinity, Infinity]
  const maximum = [-Infinity, -Infinity, -Infinity]
  let maximumRadius = 0
  for (let i = 0; i < mesh.positions.length; i += 3) {
    for (let axis = 0; axis < 3; axis++) {
      minimum[axis] = Math.min(minimum[axis]!, mesh.positions[i + axis]!)
      maximum[axis] = Math.max(maximum[axis]!, mesh.positions[i + axis]!)
    }
    maximumRadius = Math.max(
      maximumRadius,
      Math.hypot(mesh.positions[i]!, mesh.positions[i + 1]!),
    )
  }
  return { minimum, maximum, maximumRadius }
}
