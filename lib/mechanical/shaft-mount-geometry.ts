import jscad from "@jscad/modeling"
import { indexedMeshToGeom3 } from "./indexedMeshToGeom3"

type Geom3 = jscad.geometries.geom3.Geom3
export type ShaftMountMesh = { positions: number[]; indices: number[] }
export type MountingHole = {
  start: readonly [number, number, number]
  direction: readonly [number, number, number]
  diameter: number
  depth: number
  threadPitch?: number
  threadHand?: "left" | "right"
}
const bodySegments = 64
const threadSegments = 24
const samplesPerTurn = 12

/** A renderer allocation guard, independent of modelprinter's part contract. */
export function assertShaftMountResolution(holes: readonly MountingHole[]) {
  let triangles = 0
  for (const hole of holes) {
    const steps = hole.threadPitch
      ? Math.ceil((hole.depth / hole.threadPitch) * samplesPerTurn)
      : 1
    if (!Number.isFinite(steps) || steps > 768)
      throw new Error(
        "Shaft mount exceeds mesh resolution limit (64 thread turns per hole)",
      )
    triangles += (steps + 1) * threadSegments * 2
  }
  if (triangles > 100000)
    throw new Error("Shaft mount exceeds total mesh resolution limit")
}

/** Revolve the contract meridian, including entry chamfers and a sharp midpoint
 * shoulder, with bore facets circumscribed around the nominal shaft clearance.
 * The caller obtains all dimensions from modelprinter.
 */
export function createAnnularSleeve({
  outerRadius,
  boreARadius,
  boreBRadius = boreARadius,
  length,
  chamfer,
  stepZ = length / 2,
}: {
  outerRadius: number
  boreARadius: number
  boreBRadius?: number
  length: number
  chamfer: number
  stepZ?: number
}): Geom3 {
  const halfAngle = Math.PI / bodySegments
  const cosine = Math.cos(halfAngle)
  // Outside polygons are inscribed; bore polygons circumscribe the nominal
  // shaft circle. Reject a ligament too thin to survive those approximations.
  if (
    (Math.max(boreARadius, boreBRadius) + chamfer) / cosine >=
    (outerRadius - chamfer) * cosine - 1e-6
  )
    throw new Error(
      "Shaft mount wall/chamfer ligament exceeds mesh resolution limit",
    )
  const raw: [number, number, boolean][] = [
    [0, outerRadius - chamfer, false],
    [chamfer, outerRadius, false],
    [length - chamfer, outerRadius, false],
    [length, outerRadius - chamfer, false],
    [length, boreBRadius + chamfer, true],
    [length - chamfer, boreBRadius, true],
    [stepZ, boreBRadius, true],
    [stepZ, boreARadius, true],
    [chamfer, boreARadius, true],
    [0, boreARadius + chamfer, true],
  ]
  const profile = raw.filter(
    ([z, r], i) => i === 0 || z !== raw[i - 1]![0] || r !== raw[i - 1]![1],
  )
  const positions: number[] = []
  const indices: number[] = []
  for (const [z, r, isBore] of profile)
    for (let i = 0; i < bodySegments; i++) {
      // Tangent flats at the cardinal axes preserve nominal shaft clearance
      // even where a radial thread crest reaches its analytic bore endpoint.
      const angle = ((i + (isBore ? 0.5 : 0)) * Math.PI * 2) / bodySegments
      const radius = isBore ? r / cosine : r
      positions.push(radius * Math.cos(angle), radius * Math.sin(angle), z)
    }
  for (let row = 0; row < profile.length; row++)
    for (let i = 0; i < bodySegments; i++) {
      const next = (i + 1) % bodySegments
      const a = row * bodySegments + i,
        b = row * bodySegments + next
      const c = ((row + 1) % profile.length) * bodySegments + next,
        d = ((row + 1) % profile.length) * bodySegments + i
      indices.push(a, b, c, a, c, d)
    }
  return indexedMeshToGeom3({ positions, indices })
}

/** Closed cutter with a truncated nominal 60-degree helical wall. Major
 * diameter equals the contract's thread diameter; hand follows the hole axis.
 * End extensions lie in the existing bore/slit/exterior, never in solid material.
 */
export function createMountingHoleCutter(hole: MountingHole): Geom3 {
  assertShaftMountResolution([hole])
  const pitch = hole.threadPitch
  const steps = pitch
    ? Math.max(2, Math.ceil((hole.depth / pitch) * samplesPerTurn))
    : 1
  const segments = pitch ? threadSegments : 48
  const extension = 1e-4
  const radius = hole.diameter / 2
  const threadDepth = pitch ? Math.min(pitch * 0.541266, radius * 0.8) : 0
  const hand = hole.threadHand === "left" ? -1 : 1
  const positions: number[] = []
  const indices: number[] = []
  const [dx, dy, dz] = hole.direction
  if (Math.abs(dz) > 1e-10 || Math.abs(Math.hypot(dx, dy) - 1) > 1e-10)
    throw new Error("Expected a horizontal unit hole axis")
  const push = (x: number, y: number, z: number) => {
    // ex=world +Z, ey=(dy,-dx,0), ez=the documented hole direction.
    positions.push(
      hole.start[0] + y * dy + z * dx,
      hole.start[1] - y * dx + z * dy,
      hole.start[2] + x,
    )
  }
  for (let row = 0; row <= steps; row++) {
    const z = -extension + ((hole.depth + 2 * extension) * row) / steps
    for (let i = 0; i < segments; i++) {
      const angle = (i * Math.PI * 2) / segments
      const phase = pitch
        ? (((z / pitch - (hand * angle) / (Math.PI * 2)) % 1) + 1) % 1
        : 0
      const distance = Math.min(phase, 1 - phase)
      const r =
        radius -
        Math.min(
          threadDepth,
          Math.max(0, (distance - 1 / 8) * (pitch ?? 0) * Math.sqrt(3)),
        )
      push(r * Math.cos(angle), r * Math.sin(angle), z)
    }
  }
  for (let row = 0; row < steps; row++)
    for (let i = 0; i < segments; i++) {
      const next = (i + 1) % segments
      const a = row * segments + i,
        b = row * segments + next,
        c = (row + 1) * segments + next,
        d = (row + 1) * segments + i
      indices.push(a, b, c, a, c, d)
    }
  for (const end of [0, steps]) {
    const center = positions.length / 3
    push(0, 0, end === 0 ? -extension : hole.depth + extension)
    for (let i = 0; i < segments; i++) {
      const a = end * segments + i,
        b = end * segments + ((i + 1) % segments)
      indices.push(center, end === 0 ? b : a, end === 0 ? a : b)
    }
  }
  return indexedMeshToGeom3({ positions, indices })
}

/** Work above JSCAD's absolute BSP epsilon so small thread/bore intersection
 * fragments are retained. Scale back before producing the millimeter mesh.
 */
export function subtractShaftMountParts(
  body: Geom3,
  ...cutters: Geom3[]
): Geom3 {
  const factor = 100
  const scaled = [body, ...cutters].map((geometry) =>
    jscad.transforms.scale([factor, factor, factor], geometry),
  )
  const result = jscad.booleans.subtract(scaled[0]!, ...scaled.slice(1))
  return jscad.transforms.scale([1 / factor, 1 / factor, 1 / factor], result)
}

/** Weld CSG seam coordinates, insert every missing T-junction vertex on an
 * unmatched edge, then triangulate with unsnapped face centers. A plain polygon
 * fan loses collinear seam vertices; JSCAD's snapped centers can move off-plane.
 */
export function finishShaftMountMesh(geometry: Geom3): ShaftMountMesh {
  const positions: number[] = []
  const vertices = new Map<string, number[]>()
  const tolerance = 1e-6
  const weld = (point: readonly number[]) => {
    const cell = point.map((v) => Math.floor(v / tolerance))
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++) {
          const nearby =
            vertices.get(
              [cell[0]! + x, cell[1]! + y, cell[2]! + z].join(","),
            ) ?? []
          for (const index of nearby)
            if (
              Math.hypot(
                ...point.map((v, axis) => v - positions[index * 3 + axis]!),
              ) < tolerance
            )
              return index
        }
    const index = positions.length / 3
    positions.push(...point)
    const key = cell.join(",")
    vertices.set(key, [...(vertices.get(key) ?? []), index])
    return index
  }
  const polygons = jscad.geometries.geom3
    .toPolygons(geometry)
    .map((polygon) =>
      polygon.vertices
        .map(weld)
        .filter((id, i, ids) => id !== ids[(i + ids.length - 1) % ids.length]),
    )
    .map((ids) => [...new Set(ids)])
    .filter((ids) => ids.length >= 3)
    .filter((ids) => {
      // A CSG sliver narrower than the weld tolerance has collapsed to a seam.
      // Keeping it while splitting its long edge would overlap adjacent faces.
      let longest = 0
      let origin: number[] = []
      let direction: number[] = []
      for (let i = 0; i < ids.length; i++)
        for (let j = i + 1; j < ids.length; j++) {
          const a = positions.slice(ids[i]! * 3, ids[i]! * 3 + 3)
          const delta = positions
            .slice(ids[j]! * 3, ids[j]! * 3 + 3)
            .map((v, axis) => v - a[axis]!)
          const squared = delta.reduce((sum, v) => sum + v * v, 0)
          if (squared > longest) {
            longest = squared
            origin = a
            direction = delta
          }
        }
      return ids.some((id) => {
        const delta = positions
          .slice(id * 3, id * 3 + 3)
          .map((v, axis) => v - origin[axis]!)
        const t =
          delta.reduce((sum, v, axis) => sum + v * direction[axis]!, 0) /
          longest
        return (
          Math.hypot(...delta.map((v, axis) => v - t * direction[axis]!)) >=
          tolerance
        )
      })
    })
  const edgeKey = (a: number, b: number) =>
    `${Math.min(a, b)},${Math.max(a, b)}`
  const edges = new Map<string, { a: number; b: number; count: number }>()
  for (const polygon of polygons)
    for (let i = 0; i < polygon.length; i++) {
      const a = polygon[i]!,
        b = polygon[(i + 1) % polygon.length]!,
        key = edgeKey(a, b)
      const edge = edges.get(key) ?? { a, b, count: 0 }
      edge.count++
      edges.set(key, edge)
    }
  const unmatched = [...edges.values()].filter((edge) => edge.count === 1)
  const candidates = [...new Set(unmatched.flatMap((edge) => [edge.a, edge.b]))]
  const splits = new Map<string, number[]>()
  for (const { a, b } of unmatched) {
    const origin = positions.slice(a * 3, a * 3 + 3)
    const direction = positions
      .slice(b * 3, b * 3 + 3)
      .map((v, axis) => v - origin[axis]!)
    const squared = direction.reduce((sum, v) => sum + v * v, 0)
    const points: { id: number; t: number }[] = []
    for (const id of candidates) {
      if (id === a || id === b) continue
      const delta = positions
        .slice(id * 3, id * 3 + 3)
        .map((v, axis) => v - origin[axis]!)
      const t =
        delta.reduce((sum, v, axis) => sum + v * direction[axis]!, 0) / squared
      if (t <= 0 || t >= 1) continue
      const distance = Math.hypot(
        ...delta.map((v, axis) => v - t * direction[axis]!),
      )
      if (distance < tolerance) points.push({ id, t })
    }
    points.sort((p, q) => p.t - q.t)
    splits.set(
      `${a},${b}`,
      points.map((p) => p.id),
    )
    splits.set(`${b},${a}`, points.map((p) => p.id).reverse())
  }
  const indices: number[] = []
  for (const polygon of polygons) {
    const perimeter = polygon.flatMap((a, i) => [
      a,
      ...(
        splits.get(`${a},${polygon[(i + 1) % polygon.length]!}`) ?? []
      ).filter((id) => !polygon.includes(id)),
    ])
    const unique = perimeter.filter(
      (id, i) =>
        id !== perimeter[(i + perimeter.length - 1) % perimeter.length],
    )
    if (unique.length === 3) {
      indices.push(...unique)
      continue
    }
    const center = positions.length / 3
    positions.push(
      ...[0, 1, 2].map(
        (axis) =>
          unique.reduce((sum, id) => sum + positions[id * 3 + axis]!, 0) /
          unique.length,
      ),
    )
    for (let i = 0; i < unique.length; i++)
      indices.push(center, unique[i]!, unique[(i + 1) % unique.length]!)
  }
  // Compact vertices after dropping zero-length CSG edges.
  const compact: number[] = []
  const remap = new Map<number, number>()
  return {
    positions: compact,
    indices: indices.map((index) => {
      let next = remap.get(index)
      if (next === undefined) {
        next = compact.length / 3
        remap.set(index, next)
        compact.push(...positions.slice(index * 3, index * 3 + 3))
      }
      return next
    }),
  }
}
