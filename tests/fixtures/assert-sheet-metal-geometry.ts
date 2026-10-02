import { expect } from "bun:test"
import { createSheetMetalMesh } from "../../lib/mechanical/sheet-metal-mesh"
import { sheetMetalExamples } from "./sheet-metal-examples"

export function assertSheetMetalGeometry() {
  for (const props of sheetMetalExamples) {
    const mesh = createSheetMetalMesh(props)
    // Check the emitted surface, welding triangle corners geometrically.
    const edges = new Map<string, { count: number; balance: number }>()
    let volume = 0
    for (let i = 0; i < mesh.indices.length; i += 3) {
      const points = mesh.indices
        .slice(i, i + 3)
        .map((index) => mesh.positions.slice(index * 3, index * 3 + 3))
      const [a, b, c] = points as [number[], number[], number[]]
      volume +=
        (a[0]! * (b[1]! * c[2]! - b[2]! * c[1]!) +
          a[1]! * (b[2]! * c[0]! - b[0]! * c[2]!) +
          a[2]! * (b[0]! * c[1]! - b[1]! * c[0]!)) /
        6
      const keys = points.map((point) =>
        point.map((n) => Math.round(n * 1e7)).join(","),
      )
      for (let j = 0; j < 3; j++) {
        const a = keys[j]!,
          b = keys[(j + 1) % 3]!
        expect(a).not.toBe(b)
        const key = [a, b].sort().join("|"),
          edge = edges.get(key) ?? { count: 0, balance: 0 }
        edge.count++
        edge.balance += a < b ? 1 : -1
        edges.set(key, edge)
      }
    }
    expect(volume).toBeGreaterThan(100)
    for (const [key, edge] of edges.entries())
      expect(edge, `${props.profile}: ${key}`).toEqual({ count: 2, balance: 0 })
  }
  expect(() =>
    createSheetMetalMesh({
      width: 10,
      baseLength: 10,
      holes: [{ panel: "base", shape: "round", diameter: 4, u: 4, v: 0 }],
    }),
  ).toThrow("edge")
  expect(() =>
    createSheetMetalMesh({
      width: 10,
      baseLength: 10,
      holes: [{ panel: "right", shape: "round", diameter: 2, u: 0, v: 0 }],
    }),
  ).toThrow("panel")
}
