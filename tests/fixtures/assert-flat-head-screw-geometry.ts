import { expect } from "bun:test"
import { createFlatHeadScrewMesh } from "../../lib/models/flatheadscrew"
import { flatHeadScrewModelPropsSchema } from "@tscircuit/modelprinter"

export function assertFlatHeadScrewGeometry() {
  for (const metricSize of ["M3", "M4", "M5", "M6"] as const) {
    const input = { metricSize, length: 10 }
    const p = flatHeadScrewModelPropsSchema.parse(input)
    const mesh = createFlatHeadScrewMesh(input)
    expect(mesh.positions.every(Number.isFinite)).toBe(true)
    const edges = new Map<string, { count: number; direction: number }>()
    let volume = 0
    for (let i = 0; i < mesh.indices.length; i += 3) {
      const tri = mesh.indices.slice(i, i + 3),
        [a, b, c] = tri.map((i) => mesh.positions.slice(3 * i, 3 * i + 3))
      const cross = [
        b![1]! * c![2]! - b![2]! * c![1]!,
        b![2]! * c![0]! - b![0]! * c![2]!,
        b![0]! * c![1]! - b![1]! * c![0]!,
      ]
      volume += a!.reduce((sum, v, j) => sum + v * cross[j]!, 0) / 6
      for (let j = 0; j < 3; j++) {
        const u = tri[j]!,
          v = tri[(j + 1) % 3]!,
          key = `${Math.min(u, v)}:${Math.max(u, v)}`
        const e = edges.get(key) ?? { count: 0, direction: 0 }
        e.count++
        e.direction += u < v ? 1 : -1
        edges.set(key, e)
      }
    }
    expect(
      [...edges.values()].every((e) => e.count === 2 && e.direction === 0),
    ).toBe(true)
    expect(volume).toBeGreaterThan(0)
    const z = mesh.positions.filter((_, i) => i % 3 === 2)
    expect(Math.min(...z)).toBe(-10)
    expect(Math.max(...z)).toBeCloseTo(0, 2)
    const threadVertices = []
    for (let k = 0; k < mesh.positions.length; k += 3) {
      const [x, y, z] = mesh.positions.slice(k, k + 3)
      if (z! > -p.length + p.threadPitch && z! < -p.headHeight - p.threadPitch)
        threadVertices.push(Math.hypot(x!, y!))
    }
    expect(Math.min(...threadVertices)).toBeCloseTo(p.threadRootDiameter / 2, 6)
    expect(Math.max(...threadVertices)).toBeCloseTo(p.diameter / 2, 6)
    const smooth = createFlatHeadScrewMesh({ ...input, showThreads: false })
    expect(mesh.positions.length).toBeGreaterThan(smooth.positions.length)
    const floor = []
    for (let k = 0; k < mesh.positions.length; k += 3)
      if (Math.abs(mesh.positions[k + 2]! + p.socketDepth) < 1e-9)
        floor.push(Math.hypot(mesh.positions[k]!, mesh.positions[k + 1]!))
    expect(Math.max(...floor)).toBeCloseTo(
      p.socketAcrossFlats / Math.sqrt(3),
      8,
    )
    expect(
      mesh.positions.some(
        (v, i) =>
          i % 3 === 0 &&
          v === 0 &&
          mesh.positions[i + 1] === 0 &&
          mesh.positions[i + 2] === -p.socketDepth,
      ),
    ).toBe(true)
    const left = createFlatHeadScrewMesh({ ...input, threadHand: "left" })
    const points = (m: typeof mesh) =>
      m.positions.slice(0, 96 * 3).map((v) => Math.round(v * 1e8))
    expect(points(left)).toEqual(points(mesh)) // symmetric tip; handedness changes succeeding rings
    expect(left.positions).not.toEqual(mesh.positions)
  }
  expect(() =>
    createFlatHeadScrewMesh(
      { metricSize: "M3", length: 10 },
      { radialSegments: 25 },
    ),
  ).toThrow("resolution")
  expect(() =>
    createFlatHeadScrewMesh(
      { metricSize: "M3", length: 10 },
      { threadStepsPerTurn: 1 },
    ),
  ).toThrow("resolution")
}
