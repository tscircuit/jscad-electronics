import {
  hexBoltModelPropsSchema,
  type HexBoltModelPropsInput,
} from "@tscircuit/modelprinter"

export interface HexBoltMeshOptions {
  radialSegments?: number
  threadStepsPerTurn?: number
}

/** Outward-oriented, welded indexed surface, in millimeters. */
export interface HexBoltMesh {
  positions: number[]
  indices: number[]
}

export function createHexBoltMesh(
  input: HexBoltModelPropsInput,
  options: HexBoltMeshOptions = {},
): HexBoltMesh {
  const p = hexBoltModelPropsSchema.parse(input)
  const segments = options.radialSegments ?? 96
  const axial = options.threadStepsPerTurn ?? 24
  if (
    !Number.isInteger(segments) ||
    segments < 24 ||
    segments > 192 ||
    segments % 24 !== 0 ||
    !Number.isInteger(axial) ||
    axial < 24 ||
    axial > 96
  )
    throw new Error(
      "Screw mesh resolution requires 24..192 radial segments divisible by 24 and 24..96 thread steps",
    )
  const positions: number[] = [],
    indices: number[] = []
  const welded = new Map<string, number>()
  const vertex = (x: number, y: number, z: number) => {
    const key = [x, y, z].map((v) => Math.round(v * 1e10)).join(":")
    const existing = welded.get(key)
    if (existing !== undefined) return existing
    const index = positions.length / 3
    positions.push(x, y, z)
    welded.set(key, index)
    return index
  }
  const triangle = (a: number, b: number, c: number) => {
    if (a === b || b === c || c === a) return
    const point = (i: number) => positions.slice(3 * i, 3 * i + 3)
    const A = point(a),
      B = point(b),
      C = point(c)
    const u = B.map((v, i) => v - A[i]!),
      v = C.map((w, i) => w - A[i]!)
    const area = Math.hypot(
      u[1]! * v[2]! - u[2]! * v[1]!,
      u[2]! * v[0]! - u[0]! * v[2]!,
      u[0]! * v[1]! - u[1]! * v[0]!,
    )
    if (area > 1e-12) indices.push(a, b, c)
  }
  const ring = (
    radiusAt: (theta: number) => number,
    zAt: number | ((theta: number) => number),
  ) =>
    Array.from({ length: segments }, (_, i) => {
      const theta = (i * 2 * Math.PI) / segments,
        r = radiusAt(theta)
      return vertex(
        r * Math.cos(theta),
        r * Math.sin(theta),
        typeof zAt === "number" ? zAt : zAt(theta),
      )
    })
  const connect = (a: number[], b: number[]) => {
    for (let i = 0; i < segments; i++) {
      const n = (i + 1) % segments
      triangle(a[i]!, a[n]!, b[n]!)
      triangle(a[i]!, b[n]!, b[i]!)
    }
  }
  const cap = (a: number[], z: number, up: boolean) => {
    const c = vertex(0, 0, z)
    for (let i = 0; i < segments; i++) {
      const n = (i + 1) % segments
      up ? triangle(c, a[i]!, a[n]!) : triangle(c, a[n]!, a[i]!)
    }
  }
  let previous: number[] = []
  const add = (
    radiusAt: (theta: number) => number,
    zAt: number | ((theta: number) => number),
  ) => {
    const r = ring(radiusAt, zAt)
    if (previous.length) connect(previous, r)
    previous = r
    return r
  }
  const major = p.diameter / 2,
    minor = p.threadRootDiameter / 2,
    pitch = p.threadPitch
  const shaftEnd = -p.underHeadRadius
  const steps = p.showThreads
    ? Math.ceil(((shaftEnd + p.length) / pitch) * axial)
    : 1
  if ((steps + 100) * segments > 400000)
    throw new Error("Screw exceeds mesh resolution limit")
  const levels = new Set<number>([
    -p.length,
    -p.length + p.tipChamfer,
    shaftEnd,
  ])
  if (p.showThreads)
    for (let i = 0; i <= steps; i++)
      levels.add(-p.length + ((shaftEnd + p.length) * i) / steps)
  for (const z of [...levels].sort((a, b) => a - b)) {
    const r = add((theta) => {
      // Phase is fixed at +X on the nominal tip plane, before chamfer clipping.
      const phase =
        ((((z + p.length) / pitch -
          ((p.threadHand === "right" ? 1 : -1) * theta) / (2 * Math.PI)) %
          1) +
          1) %
        1
      const d = Math.min(phase, 1 - phase)
      const groove = Math.min(
        major - minor,
        Math.max(0, (d - 1 / 16) * pitch * Math.sqrt(3)),
      )
      const thread = p.showThreads ? major - groove : major
      return Math.min(
        thread,
        major - Math.max(0, p.tipChamfer - (z + p.length)),
      )
    }, z)
    if (z === -p.length) cap(r, z, false)
  }
  // Tangent circular under-head blend; its start also trims incomplete crests.
  add(() => major, shaftEnd)
  const filletCenterR = major + p.underHeadRadius
  const filletCenterZ = shaftEnd
  for (let i = 1; i <= 16; i++) {
    const angle = Math.PI - ((Math.PI - Math.PI / 2) * i) / 16
    add(
      () => filletCenterR + p.underHeadRadius * Math.cos(angle),
      filletCenterZ + p.underHeadRadius * Math.sin(angle),
    )
  }

  const hexRadius = (theta: number) =>
    p.headAcrossFlats /
    2 /
    Math.max(
      Math.abs(Math.sin(theta)),
      Math.abs(Math.sin(theta + (2 * Math.PI) / 3)),
      Math.abs(Math.sin(theta + (4 * Math.PI) / 3)),
    )
  add(hexRadius, 0)
  const slope = Math.tan((p.headChamferAngle * Math.PI) / 180)
  const start =
    p.headHeight - ((p.headCornerDiameter - p.headChamferDiameter) / 2) * slope
  add(hexRadius, start)
  for (let i = 1; i <= 12; i++) {
    const z = start + ((p.headHeight - start) * i) / 12
    add(
      (theta) =>
        Math.min(
          hexRadius(theta),
          p.headChamferDiameter / 2 + (p.headHeight - z) / slope,
        ),
      z,
    )
  }
  cap(previous, p.headHeight, true)

  return { positions, indices }
}
