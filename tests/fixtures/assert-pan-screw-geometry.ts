import { expect } from "bun:test"
import { createPanScrewMesh } from "../../lib/PanScrew"
import { panScrewModelPropsSchema } from "@tscircuit/modelprinter"

export function assertPanScrewGeometry() {
  for (const metricSize of ["M3", "M4", "M5", "M6"] as const) {
    const input = { metricSize, length: 10 }
    const p = panScrewModelPropsSchema.parse(input)
    const mesh = createPanScrewMesh(input)
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
    expect(Math.max(...z)).toBeLessThanOrEqual(p.headHeight)
    expect(Math.max(...z)).toBeGreaterThan(p.headHeight - 0.15)
    const threadVertices = []
    for (let k = 0; k < mesh.positions.length; k += 3) {
      const [x, y, z] = mesh.positions.slice(k, k + 3)
      if (z! > -p.length + p.threadPitch && z! < -p.headHeight - p.threadPitch)
        threadVertices.push(Math.hypot(x!, y!))
    }
    expect(Math.min(...threadVertices)).toBeCloseTo(p.threadRootDiameter / 2, 6)
    expect(Math.max(...threadVertices)).toBeCloseTo(p.diameter / 2, 6)
    const smooth = createPanScrewMesh({ ...input, showThreads: false })
    expect(mesh.positions.length).toBeGreaterThan(smooth.positions.length)
    const gDepth =
      (p.recessReferenceDiameter - p.recessG) /
      2 /
      Math.tan((p.recessOuterWingAngle * Math.PI) / 180)
    const floor =
      p.recessReferencePlaneHeight -
      gDepth -
      (p.recessG / 2) * Math.tan((p.recessInnerWingAngle * Math.PI) / 180)
    expect(
      mesh.positions.some(
        (v, i) =>
          i % 3 === 0 &&
          v === 0 &&
          mesh.positions[i + 1] === 0 &&
          Math.abs(mesh.positions[i + 2]! - floor) < 1e-9,
      ),
    ).toBe(true)
    // Fit the actual rounded wing-entry points to a circle, then verify its
    // physical radius and tangency to both the crown and the nominal wing wall.
    const slope = Math.tan((p.recessOuterWingAngle * Math.PI) / 180)
    const wall =
      p.recessReferenceDiameter / 2 - slope * p.recessReferencePlaneHeight
    const entry = []
    for (let i = 0; i < mesh.positions.length; i += 3) {
      const [r, y, z] = mesh.positions.slice(i, i + 3)
      if (
        r! > 0 &&
        Math.abs(y!) < 1e-9 &&
        z! > 0 &&
        Math.hypot(r!, z! - (p.headHeight - p.crownRadius)) <
          p.crownRadius - 1e-9 &&
        r! - slope * z! - wall > 1e-9
      )
        entry.push([r!, z!] as const)
    }
    expect(entry.length).toBeGreaterThan(12)
    const a = entry[0]!,
      b = entry[Math.floor(entry.length / 2)]!,
      c = entry.at(-1)!
    const det =
      2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]))
    const norm = (q: readonly number[]) => q[0]! ** 2 + q[1]! ** 2
    const centerR =
      (norm(a) * (b[1] - c[1]) +
        norm(b) * (c[1] - a[1]) +
        norm(c) * (a[1] - b[1])) /
      det
    const centerZ =
      (norm(a) * (c[0] - b[0]) +
        norm(b) * (a[0] - c[0]) +
        norm(c) * (b[0] - a[0])) /
      det
    expect(Math.hypot(a[0] - centerR, a[1] - centerZ)).toBeCloseTo(
      p.recessRadius,
      7,
    )
    expect(
      entry.every(
        ([r, z]) =>
          Math.abs(Math.hypot(r - centerR, z - centerZ) - p.recessRadius) <
          1e-8,
      ),
    ).toBe(true)
    expect(
      Math.hypot(centerR, centerZ - (p.headHeight - p.crownRadius)) +
        p.recessRadius,
    ).toBeCloseTo(p.crownRadius, 7)
    expect(
      (centerR - slope * centerZ - wall) / Math.hypot(1, slope),
    ).toBeCloseTo(p.recessRadius, 7)
    // Check every meridian in one quadrant, including corner-limited entries.
    // A retraced wall can have manifold edge counts while intersecting itself.
    for (let ray = 0; ray < 24; ray++) {
      const theta = (ray * Math.PI) / 48
      const points: [number, number][] = []
      for (let i = 0; i < mesh.positions.length; i += 3) {
        const [x, y, z] = mesh.positions.slice(i, i + 3)
        const r = Math.hypot(x!, y!)
        if (r > 1e-9 && Math.abs(Math.atan2(y!, x!) - theta) < 1e-9)
          points.push([r, z!])
      }
      const rimZ =
        p.headHeight -
        p.crownRadius +
        Math.sqrt(p.crownRadius ** 2 - (p.headDiameter / 2) ** 2)
      const rim = points.findIndex(
        ([r, z]) =>
          Math.abs(r - p.headDiameter / 2) < 1e-9 && Math.abs(z - rimZ) < 1e-9,
      )
      expect(rim).toBeGreaterThanOrEqual(0)
      const profile = [...points.slice(rim), [0, floor] as [number, number]]
      expect(hasCrossing(profile)).toBe(false)
    }
    const left = createPanScrewMesh({ ...input, threadHand: "left" })
    const points = (m: typeof mesh) =>
      m.positions.slice(0, 96 * 3).map((v) => Math.round(v * 1e8))
    expect(points(left)).toEqual(points(mesh)) // symmetric tip; handedness changes succeeding rings
    expect(left.positions).not.toEqual(mesh.positions)
  }
  expect(() =>
    createPanScrewMesh(
      { metricSize: "M3", length: 10 },
      { radialSegments: 25 },
    ),
  ).toThrow("resolution")
  expect(() =>
    createPanScrewMesh(
      { metricSize: "M3", length: 10 },
      { threadStepsPerTurn: 1 },
    ),
  ).toThrow("resolution")
}

function hasCrossing(points: [number, number][]) {
  const cross = (a: number[], b: number[], c: number[]) =>
    (b[0]! - a[0]!) * (c[1]! - a[1]!) - (b[1]! - a[1]!) * (c[0]! - a[0]!)
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = i + 2; j < points.length - 1; j++) {
      const a = points[i]!,
        b = points[i + 1]!,
        c = points[j]!,
        d = points[j + 1]!
      const abC = cross(a, b, c),
        abD = cross(a, b, d),
        cdA = cross(c, d, a),
        cdB = cross(c, d, b)
      if (abC * abD < -1e-16 && cdA * cdB < -1e-16) return true
      if ([abC, abD, cdA, cdB].every((v) => Math.abs(v) < 1e-10)) {
        const axis = Math.abs(b[0] - a[0]) > Math.abs(b[1] - a[1]) ? 0 : 1
        const overlap =
          Math.min(Math.max(a[axis]!, b[axis]!), Math.max(c[axis]!, d[axis]!)) -
          Math.max(Math.min(a[axis]!, b[axis]!), Math.min(c[axis]!, d[axis]!))
        if (overlap > 1e-8) return true
      }
    }
  }
  return false
}
