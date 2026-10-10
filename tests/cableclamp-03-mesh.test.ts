import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getCableClampDimensions } from "@tscircuit/modelprinter"
import {
  createCableClampGeom,
  createCableClampMesh,
} from "../lib/models/cableclamp/geometry"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { source, p } from "./fixtures/cableclamp-example"

test("cableclamp finite nondegenerate closed indexed mesh", () => {
  const mesh = createCableClampMesh(p)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(mesh.indices.length).toBeGreaterThan(0)
  expect(mesh.indices.length % 3).toBe(0)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  const edges = new Map<string, { count: number; balance: number }>()
  let minimumArea = Infinity
  for (let i = 0; i < mesh.indices.length; i += 3) {
    const triangle = mesh.indices
      .slice(i, i + 3)
      .map((index) => mesh.positions.slice(index * 3, index * 3 + 3))
    const [a, b, c] = triangle as [number[], number[], number[]]
    const u = b.map((x, j) => x - a[j]!),
      v = c.map((x, j) => x - a[j]!)
    minimumArea = Math.min(
      minimumArea,
      Math.hypot(
        u[1]! * v[2]! - u[2]! * v[1]!,
        u[2]! * v[0]! - u[0]! * v[2]!,
        u[0]! * v[1]! - u[1]! * v[0]!,
      ),
    )
    for (let j = 0; j < 3; j++) {
      const a = mesh.indices[i + j]!,
        b = mesh.indices[i + ((j + 1) % 3)]!
      const key = [Math.min(a, b), Math.max(a, b)].join(",")
      const previous = edges.get(key) ?? { count: 0, balance: 0 }
      edges.set(key, {
        count: previous.count + 1,
        balance: previous.balance + (a < b ? 1 : -1),
      })
    }
  }
  expect(minimumArea).toBeGreaterThan(0)
  expect(
    [...edges.values()].every((edge) => edge.count === 2 && edge.balance === 0),
  ).toBe(true)
})
