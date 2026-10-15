import { expect } from "bun:test"
export type Mesh = { positions: number[]; indices: number[] }
/** Verify actual indexed topology and orientation, independent of the factory. */
export function assertClosedMesh(mesh: Mesh) {
  expect(mesh.positions.length % 3).toBe(0)
  expect(mesh.indices.length % 3).toBe(0)
  expect(mesh.indices.length).toBeGreaterThan(0)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  const edges = new Map<string, { count: number; balance: number }>()
  let volume = 0
  for (let i = 0; i < mesh.indices.length; i += 3) {
    const vertices = mesh.indices
      .slice(i, i + 3)
      .map((index) => mesh.positions.slice(index * 3, index * 3 + 3))
    const [a, b, c] = vertices as [number[], number[], number[]]
    const u = b.map((v, axis) => v - a[axis]!),
      v = c.map((v, axis) => v - a[axis]!)
    expect(
      Math.hypot(
        u[1]! * v[2]! - u[2]! * v[1]!,
        u[2]! * v[0]! - u[0]! * v[2]!,
        u[0]! * v[1]! - u[1]! * v[0]!,
      ),
    ).toBeGreaterThan(0)
    volume +=
      (a[0]! * (b[1]! * c[2]! - b[2]! * c[1]!) +
        a[1]! * (b[2]! * c[0]! - b[0]! * c[2]!) +
        a[2]! * (b[0]! * c[1]! - b[1]! * c[0]!)) /
      6
    for (let edge = 0; edge < 3; edge++) {
      const a = mesh.indices[i + edge]!,
        b = mesh.indices[i + ((edge + 1) % 3)]!
      const key = [Math.min(a, b), Math.max(a, b)].join(",")
      const prev = edges.get(key) ?? { count: 0, balance: 0 }
      edges.set(key, {
        count: prev.count + 1,
        balance: prev.balance + (a < b ? 1 : -1),
      })
    }
  }
  expect(
    [...edges.values()].every((e) => e.count === 2 && e.balance === 0),
  ).toBe(true)
  expect(volume).toBeGreaterThan(0)
}
/** Solid-angle containment inspects material, not just nominal dimensions. */
export function containsPoint(
  mesh: Mesh,
  point: readonly [number, number, number],
) {
  let angle = 0
  for (let i = 0; i < mesh.indices.length; i += 3) {
    const v = mesh.indices
      .slice(i, i + 3)
      .map((index) =>
        mesh.positions
          .slice(index * 3, index * 3 + 3)
          .map((value, axis) => value - point[axis]!),
      )
    const [a, b, c] = v as [number[], number[], number[]]
    const la = Math.hypot(...a),
      lb = Math.hypot(...b),
      lc = Math.hypot(...c)
    const dot = (u: number[], v: number[]) =>
      u.reduce((sum, value, axis) => sum + value * v[axis]!, 0)
    const det =
      a[0]! * (b[1]! * c[2]! - b[2]! * c[1]!) +
      a[1]! * (b[2]! * c[0]! - b[0]! * c[2]!) +
      a[2]! * (b[0]! * c[1]! - b[1]! * c[0]!)
    angle +=
      2 *
      Math.atan2(
        det,
        la * lb * lc + dot(a, b) * lc + dot(b, c) * la + dot(c, a) * lb,
      )
  }
  return Math.abs(angle) > 2 * Math.PI
}
