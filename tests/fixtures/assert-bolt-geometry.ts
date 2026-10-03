import { expect } from "bun:test"
import { hexSocketBoltDimensions } from "@tscircuit/modelprinter"
import { createHexSocketBoltMesh } from "../../lib/mechanical/hex-socket-bolt-mesh"

export function assertBoltGeometry() {
  for (const metricSize of Object.keys(
    hexSocketBoltDimensions,
  ) as (keyof typeof hexSocketBoltDimensions)[]) {
    const { positions, indices } = createHexSocketBoltMesh({
      metricSize,
      length: 6,
    })
    const dims = hexSocketBoltDimensions[metricSize]
    const axes = [0, 1, 2].map((axis) =>
      positions.filter((_, i) => i % 3 === axis),
    )
    expect(Math.min(...axes[0]!)).toBeCloseTo(-dims.headDiameter / 2)
    expect(Math.max(...axes[0]!)).toBeCloseTo(dims.headDiameter / 2)
    expect(Math.min(...axes[2]!)).toBe(-6)
    expect(Math.max(...axes[2]!)).toBe(dims.headHeight)
    expect(positions.every(Number.isFinite)).toBe(true)
    const edges = new Map<string, { count: number; direction: number }>()
    let volume = 0
    let repeatedIndices = false
    for (let i = 0; i < indices.length; i += 3) {
      const tri = indices.slice(i, i + 3)
      const [a, b, c] = tri.map((v) => positions.slice(v * 3, v * 3 + 3)) as [
        number[],
        number[],
        number[],
      ]
      const cross = [
        b[1]! * c[2]! - b[2]! * c[1]!,
        b[2]! * c[0]! - b[0]! * c[2]!,
        b[0]! * c[1]! - b[1]! * c[0]!,
      ]
      volume += a.reduce((sum, v, j) => sum + v * cross[j]!, 0) / 6
      for (let j = 0; j < 3; j++) {
        const u = tri[j]!,
          v = tri[(j + 1) % 3]!
        if (u === v) repeatedIndices = true
        const key = `${Math.min(u, v)}:${Math.max(u, v)}`
        const edge = edges.get(key) ?? { count: 0, direction: 0 }
        edge.count++
        edge.direction += u < v ? 1 : -1
        edges.set(key, edge)
      }
    }
    expect(repeatedIndices).toBe(false)
    expect(
      [...edges.values()].every((e) => e.count === 2 && e.direction === 0),
    ).toBe(true)
    expect(volume).toBeGreaterThan(0)
    // The blind socket floor is at headHeight - socketDepth, with no cap
    // across the opening. Center vertices exist only at tip and floor.
    const centers = axes[2]!.filter(
      (_, i) => positions[i * 3] === 0 && positions[i * 3 + 1] === 0,
    )
    expect(centers).toEqual([-6, dims.headHeight - dims.socketDepth])
  }

  // "threading changes the shank and leaves the head geometry intact"
  {
    const threaded = createHexSocketBoltMesh({ metricSize: "M3", length: 6 })
    const smooth = createHexSocketBoltMesh({
      metricSize: "M3",
      length: 6,
      showThreads: false,
    })
    expect(threaded.indices.length).toBeGreaterThan(smooth.indices.length)
    expect(threaded.positions).not.toEqual(smooth.positions)
    const headVertices = (positions: number[]) => {
      const head = []
      for (let i = 0; i < positions.length; i += 3)
        if (positions[i + 2]! >= 0) head.push(...positions.slice(i, i + 3))
      return head
    }
    expect(headVertices(threaded.positions)).toEqual(
      headVertices(smooth.positions),
    )
    expect(() =>
      createHexSocketBoltMesh({ metricSize: "M3", length: 100000 }),
    ).toThrow("mesh resolution limit")
  }
}
