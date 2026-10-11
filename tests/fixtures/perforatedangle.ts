import { expect } from "bun:test"
import jscad from "@jscad/modeling"
export const props = {
  width: 25,
  height: 25,
  thickness: 3,
  length: 80,
  innerRadius: 3,
  holeCount: 3,
  holeDiameter: 6,
  pitch: 25,
  endOffset: 15,
  legOffset: 12.5,
} as const
export const source =
  "perforatedangle_w25mm_h25mm_t3mm_l80mm_innerr3mm_holes3_hole6mm_pitch25mm_end15mm_legoffset12.5mm"
export const checkMesh = (mesh: { positions: number[]; indices: number[] }) => {
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(mesh.indices.length % 3).toBe(0)
  expect(mesh.indices.length).toBeGreaterThan(0)
  const edges = new Map<string, { count: number; balance: number }>()
  let volume = 0
  for (let offset = 0; offset < mesh.indices.length; offset += 3) {
    const triangle = mesh.indices.slice(offset, offset + 3)
    expect(
      triangle.every(
        (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
      ),
    ).toBe(true)
    const [a, b, c] = triangle.map((index) =>
      mesh.positions.slice(index * 3, index * 3 + 3),
    ) as [number[], number[], number[]]
    const u = b.map((value, i) => value - a[i]!),
      v = c.map((value, i) => value - a[i]!)
    const cross = [
      u[1]! * v[2]! - u[2]! * v[1]!,
      u[2]! * v[0]! - u[0]! * v[2]!,
      u[0]! * v[1]! - u[1]! * v[0]!,
    ]
    expect(Math.hypot(...cross)).toBeGreaterThan(1e-12)
    volume +=
      (a[0]! * (b[1]! * c[2]! - b[2]! * c[1]!) +
        a[1]! * (b[2]! * c[0]! - b[0]! * c[2]!) +
        a[2]! * (b[0]! * c[1]! - b[1]! * c[0]!)) /
      6
    for (let i = 0; i < 3; i++) {
      const first = triangle[i]!,
        second = triangle[(i + 1) % 3]!
      const key = [Math.min(first, second), Math.max(first, second)].join(",")
      const previous = edges.get(key) ?? { count: 0, balance: 0 }
      edges.set(key, {
        count: previous.count + 1,
        balance: previous.balance + (first < second ? 1 : -1),
      })
    }
  }
  expect(
    [...edges.values()].every((edge) => edge.count === 2 && edge.balance === 0),
  ).toBe(true)
  expect(volume).toBeGreaterThan(0)
}

export const volume = (result: { geometries: { geom: unknown }[] }) =>
  result.geometries.reduce(
    (sum, g) =>
      sum +
      jscad.measurements.measureVolume(g.geom as jscad.geometries.geom3.Geom3),
    0,
  )
