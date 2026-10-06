import { expect } from "bun:test"
export type MountMesh = { positions: number[]; indices: number[] }
type Point = readonly [number, number, number]
const vertex = (mesh: MountMesh, index: number): [number, number, number] => [
  mesh.positions[index * 3]!,
  mesh.positions[index * 3 + 1]!,
  mesh.positions[index * 3 + 2]!,
]
const subtract = (a: Point, b: Point): [number, number, number] => [
  a[0] - b[0],
  a[1] - b[1],
  a[2] - b[2],
]
const cross = (a: Point, b: Point): [number, number, number] => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
]
const dot = (a: Point, b: Point) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** Checks the exported, welded triangles, not a repaired copy of the mesh. */
export function assertClosedShaftMount(mesh: MountMesh) {
  expect(mesh.positions.length % 3).toBe(0)
  expect(mesh.indices.length % 3).toBe(0)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  const count = mesh.positions.length / 3
  expect(
    mesh.indices.every((i) => Number.isInteger(i) && i >= 0 && i < count),
  ).toBe(true)
  const parents = Array.from({ length: count }, (_, i) => i)
  const find = (i: number): number => {
    while (parents[i] !== i) {
      parents[i] = parents[parents[i]!]!
      i = parents[i]!
    }
    return i
  }
  const edges = new Map<string, { count: number; direction: number }>()
  const used = new Set<number>()
  let volume = 0,
    minimumArea = Infinity
  for (let i = 0; i < mesh.indices.length; i += 3) {
    const ids = mesh.indices.slice(i, i + 3)
    const a = vertex(mesh, ids[0]!),
      b = vertex(mesh, ids[1]!),
      c = vertex(mesh, ids[2]!)
    minimumArea = Math.min(
      minimumArea,
      Math.hypot(...cross(subtract(b, a), subtract(c, a))),
    )
    volume += dot(a, cross(b, c)) / 6
    for (let j = 0; j < 3; j++) {
      const u = ids[j]!,
        v = ids[(j + 1) % 3]!
      used.add(u)
      parents[find(u)] = find(v)
      const key = `${Math.min(u, v)},${Math.max(u, v)}`
      const edge = edges.get(key) ?? { count: 0, direction: 0 }
      edge.count++
      edge.direction += u < v ? 1 : -1
      edges.set(key, edge)
    }
  }
  expect(minimumArea).toBeGreaterThan(1e-14)
  const bad = [...edges].filter(([, e]) => e.count !== 2 || e.direction !== 0)
  expect(
    bad,
    `Unmatched or multiply used seam edges: ${JSON.stringify(bad.slice(0, 5))}`,
  ).toEqual([])
  expect(used.size).toBe(count)
  expect(new Set([...used].map(find)).size).toBe(1)
  expect(Number.isFinite(volume)).toBe(true)
  expect(volume).toBeGreaterThan(0)
  return volume
}

/** Independent triangle-ray intersections; identical shared-edge hits deduplicate. */
export function meshRayHits(mesh: MountMesh, origin: Point, direction: Point) {
  const hits: number[] = []
  for (let i = 0; i < mesh.indices.length; i += 3) {
    const a = vertex(mesh, mesh.indices[i]!),
      b = vertex(mesh, mesh.indices[i + 1]!),
      c = vertex(mesh, mesh.indices[i + 2]!)
    const e1 = subtract(b, a),
      e2 = subtract(c, a),
      p = cross(direction, e2),
      det = dot(e1, p)
    if (Math.abs(det) < 1e-12) continue
    const inv = 1 / det,
      t = subtract(origin, a),
      u = dot(t, p) * inv
    if (u < -1e-9 || u > 1 + 1e-9) continue
    const q = cross(t, e1),
      v = dot(direction, q) * inv
    if (v < -1e-9 || u + v > 1 + 1e-9) continue
    const distance = dot(e2, q) * inv
    if (distance > 1e-8) hits.push(distance)
  }
  hits.sort((a, b) => a - b)
  return hits.filter((v, i) => i === 0 || v - hits[i - 1]! > 1e-6)
}
export const containsMeshPoint = (mesh: MountMesh, point: Point) =>
  meshRayHits(mesh, point, [0.823, 0.287, 0.49]).length % 2 === 1

/** A cutter endpoint must lie entirely in the bore/slit void, including its
 * outermost thread crest. An axial center ray cannot detect a peripheral cap.
 */
export function assertNoMountingEndCap(
  mesh: MountMesh,
  hole: { start: Point; direction: Point; depth: number },
) {
  let caps = 0
  for (let i = 0; i < mesh.indices.length; i += 3) {
    const face = mesh.indices.slice(i, i + 3)
    if (
      face.every(
        (id) =>
          Math.abs(
            dot(subtract(vertex(mesh, id), hole.start), hole.direction) -
              hole.depth -
              1e-4,
          ) < 1e-7,
      )
    )
      caps++
  }
  expect(
    caps,
    "Peripheral radial cutter caps must disappear into the shaft bore",
  ).toBe(0)
}
