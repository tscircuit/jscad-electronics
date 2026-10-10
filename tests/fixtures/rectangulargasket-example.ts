import { expect } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
export const rectangularGasketSource =
  "rectangulargasket_w80mm_h50mm_border5mm_t2mm_cornerr5mm_flatframe"
export const rectangularGasketProps = (() => {
  const d = mp.string(rectangularGasketSource).json()
  if (d.fn !== "rectangulargasket") throw new Error("Wrong model")
  const { fn, ...props } = d
  return props
})()
export function assertRectangularGasketClosed(mesh: {
  positions: number[]
  indices: number[]
}) {
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(mesh.indices.length).toBeGreaterThan(0)
  expect(mesh.indices.length % 3).toBe(0)
  const edges = new Map<string, { count: number; balance: number }>()
  let volume = 0
  for (let i = 0; i < mesh.indices.length; i += 3) {
    const ids = mesh.indices.slice(i, i + 3)
    expect(
      ids.every(
        (x) => Number.isInteger(x) && x >= 0 && x < mesh.positions.length / 3,
      ),
    ).toBe(true)
    const [a, b, c] = ids.map((index) =>
      mesh.positions.slice(index * 3, index * 3 + 3),
    ) as [number[], number[], number[]]
    const u = b.map((x, j) => x - a[j]!),
      v = c.map((x, j) => x - a[j]!)
    expect(
      Math.hypot(
        u[1]! * v[2]! - u[2]! * v[1]!,
        u[2]! * v[0]! - u[0]! * v[2]!,
        u[0]! * v[1]! - u[1]! * v[0]!,
      ),
    ).toBeGreaterThan(1e-12)
    volume +=
      (a[0]! * (b[1]! * c[2]! - b[2]! * c[1]!) +
        a[1]! * (b[2]! * c[0]! - b[0]! * c[2]!) +
        a[2]! * (b[0]! * c[1]! - b[1]! * c[0]!)) /
      6
    for (let j = 0; j < 3; j++) {
      const a = ids[j]!,
        b = ids[(j + 1) % 3]!
      const key = [Math.min(a, b), Math.max(a, b)].join(",")
      const edge = edges.get(key) ?? { count: 0, balance: 0 }
      edge.count++
      edge.balance += a < b ? 1 : -1
      edges.set(key, edge)
    }
  }
  expect(volume).toBeGreaterThan(0)
  for (const [edge, value] of edges)
    expect(value, edge).toEqual({ count: 2, balance: 0 })
}

export function assertRectangularGasketRayHits(
  hits: number[],
  expected: number[],
) {
  expect(hits.length).toBe(expected.length)
  for (let i = 0; i < expected.length; i++)
    expect(hits[i]).toBeCloseTo(expected[i]!, 4)
}
