import { expect } from "bun:test"
export function inspectMesh(mesh: { positions: number[]; indices: number[] }) {
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  const vertices: [number, number, number][] = []
  for (let i = 0; i < mesh.positions.length; i += 3)
    vertices.push([
      mesh.positions[i]!,
      mesh.positions[i + 1]!,
      mesh.positions[i + 2]!,
    ])
  const edges = new Map<string, { count: number; direction: number }>()
  let volume = 0
  let nondegenerate = true
  for (let i = 0; i < mesh.indices.length; i += 3) {
    const tri = mesh.indices.slice(i, i + 3)
    const [a, b, c] = tri.map((i) => vertices[i]!)
    const u = b!.map((v, i) => v - a![i]!),
      v = c!.map((v, i) => v - a![i]!)
    nondegenerate &&=
      Math.hypot(
        u[1]! * v[2]! - u[2]! * v[1]!,
        u[2]! * v[0]! - u[0]! * v[2]!,
        u[0]! * v[1]! - u[1]! * v[0]!,
      ) > 1e-12
    volume +=
      (a![0]! * (b![1]! * c![2]! - b![2]! * c![1]!) +
        a![1]! * (b![2]! * c![0]! - b![0]! * c![2]!) +
        a![2]! * (b![0]! * c![1]! - b![1]! * c![0]!)) /
      6
    for (let j = 0; j < 3; j++) {
      const u = tri[j]!,
        v = tri[(j + 1) % 3]!,
        key = `${Math.min(u, v)}:${Math.max(u, v)}`
      const edge = edges.get(key) ?? { count: 0, direction: 0 }
      edge.count++
      edge.direction += u < v ? 1 : -1
      edges.set(key, edge)
    }
  }
  expect(
    [...edges.values()].every((e) => e.count === 2 && e.direction === 0),
  ).toBe(true)
  expect(volume).toBeGreaterThan(0)
  // The screw with blind recesses is one connected genus-zero surface.
  expect(vertices.length - edges.size + mesh.indices.length / 3).toBe(2)
  const neighbours = new Map<number, Set<number>>()
  for (let i = 0; i < mesh.indices.length; i += 3)
    for (let j = 0; j < 3; j++) {
      const a = mesh.indices[i + j]!,
        b = mesh.indices[i + ((j + 1) % 3)]!
      if (!neighbours.has(a)) neighbours.set(a, new Set())
      if (!neighbours.has(b)) neighbours.set(b, new Set())
      neighbours.get(a)!.add(b)
      neighbours.get(b)!.add(a)
    }
  const visited = new Set<number>(),
    pending = [0]
  while (pending.length) {
    const at = pending.pop()!
    if (visited.has(at)) continue
    visited.add(at)
    for (const next of neighbours.get(at) ?? []) pending.push(next)
  }
  expect(visited.size).toBe(vertices.length)
  return { vertices, volume }
}
