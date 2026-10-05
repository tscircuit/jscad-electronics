import {
  panScrewModelPropsSchema,
  type PanScrewModelPropsInput,
} from "@tscircuit/modelprinter"

export interface PanScrewMeshOptions {
  radialSegments?: number
  threadStepsPerTurn?: number
}

/** Outward-oriented, welded indexed surface, in millimeters. */
export interface PanScrewMesh {
  positions: number[]
  indices: number[]
}

export function createPanScrewMesh(
  input: PanScrewModelPropsInput,
  options: PanScrewMeshOptions = {},
): PanScrewMesh {
  const p = panScrewModelPropsSchema.parse(input)
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
  if ((steps + 160) * segments > 400000)
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

  const crown = (r: number) =>
    p.headHeight -
    p.crownRadius +
    Math.sqrt(p.crownRadius * p.crownRadius - r * r)
  const rad265 = (p.recessOuterWingAngle * Math.PI) / 180,
    rad28 = (p.recessInnerWingAngle * Math.PI) / 180
  const tg = (p.recessReferenceDiameter - p.recessG) / 2 / Math.tan(rad265)
  const totalDepth = tg + (p.recessG / 2) * Math.tan(rad28)
  const tb = tg + ((p.recessG - p.recessB) / 2) * Math.tan(rad28)
  const beta = (p.recessBeta * Math.PI) / 180
  const alphaProjected = Math.atan(
    Math.tan((p.recessAlpha * Math.PI) / 360) / Math.cos(beta),
  )
  const cornerProjected = Math.atan(
    Math.tan((46 * Math.PI) / 180) / Math.cos(beta),
  )
  const dre = p.recessE / 2 / Math.tan(alphaProjected)
  // Type-H is a compound conical wing profile with four tapered corner cuts.
  const cornerRadius = (z: number, theta: number) => {
    const depth = p.recessReferencePlaneHeight - z
    const b = p.recessB / 2 - (depth - tb) * Math.tan(beta)
    const delta = Math.abs(
      ((theta - Math.PI / 4 + Math.PI / 4 + 4 * Math.PI) % (Math.PI / 2)) -
        Math.PI / 4,
    )
    const ca = Math.cos(delta),
      sa = Math.sin(delta)
    const tanA = Math.tan(alphaProjected),
      tanC = Math.tan(cornerProjected)
    const first = (tanA * b) / (tanA * ca - sa)
    const corner =
      first * ca <= b + dre
        ? first
        : (tanC * (b + dre) - p.recessE / 2) / (tanC * ca - sa)
    return Math.max(0, corner)
  }
  const recessRadius = (z: number, theta: number) => {
    const depth = p.recessReferencePlaneHeight - z
    const outer =
      depth <= tg
        ? p.recessReferenceDiameter / 2 - depth * Math.tan(rad265)
        : (totalDepth - depth) / Math.tan(rad28)
    return Math.max(0, Math.min(outer, cornerRadius(z, theta)))
  }
  // ISO 4757 r rounds the wing entry, not the g/bottom-cone junction.
  // Offset the spherical crown inward by r and the wing wall into material by r.
  // Their intersection is the center of a circle tangent to both surfaces.
  const entryRadius = p.recessRadius,
    sphereZ = p.headHeight - p.crownRadius,
    slope = Math.tan(rad265),
    line =
      p.recessReferenceDiameter / 2 -
      slope * p.recessReferencePlaneHeight +
      entryRadius / Math.cos(rad265),
    offset = slope * sphereZ + line,
    innerSphere = p.crownRadius - entryRadius,
    centerAboveSphere =
      (-slope * offset +
        Math.sqrt((1 + slope * slope) * innerSphere ** 2 - offset ** 2)) /
      (1 + slope * slope),
    entryCenterZ = sphereZ + centerAboveSphere,
    entryCenterR = slope * entryCenterZ + line,
    entryStart = Math.atan2(centerAboveSphere, entryCenterR),
    entryEnd = Math.PI - rad265,
    mouthR = entryCenterR + entryRadius * Math.cos(entryStart),
    wallZ = entryCenterZ + entryRadius * Math.sin(entryEnd)
  add(() => p.headDiameter / 2, 0)
  add(() => p.headDiameter / 2, crown(p.headDiameter / 2))
  // The wing mouth meets the crown tangentially. Corner cuts may narrow it.
  const opening = Array.from({ length: segments }, (_, i) => {
    const theta = (i * 2 * Math.PI) / segments
    let lo = 0,
      hi = mouthR
    for (let n = 0; n < 48; n++) {
      const r = (lo + hi) / 2
      if (r < cornerRadius(crown(r), theta)) lo = r
      else hi = r
    }
    return (lo + hi) / 2
  })
  for (let n = 1; n <= 20; n++) {
    const r = (theta: number) => {
      const i = Math.round((theta * segments) / (2 * Math.PI)) % segments
      return p.headDiameter / 2 + ((opening[i]! - p.headDiameter / 2) * n) / 20
    }
    add(r, (theta) => crown(r(theta)))
  }
  // A corner-limited ray joins the circle only at its true intersection.
  // Collapse earlier rows there instead of projecting them onto the wall:
  // the circle initially rises in Z, which would retrace that planar wall.
  const entryClips = Array.from({ length: segments }, (_, i) => {
    const theta = (i * 2 * Math.PI) / segments
    const point = (angle: number) => ({
      r: entryCenterR + entryRadius * Math.cos(angle),
      z: entryCenterZ + entryRadius * Math.sin(angle),
    })
    const outside = (angle: number) => {
      const q = point(angle)
      return q.r > cornerRadius(q.z, theta)
    }
    if (!outside(entryStart)) return { angle: entryStart, ...point(entryStart) }
    if (outside(entryEnd))
      return { angle: entryEnd, r: cornerRadius(wallZ, theta), z: wallZ }
    let lo = entryStart,
      hi = entryEnd
    for (let n = 0; n < 48; n++) {
      const angle = (lo + hi) / 2
      if (outside(angle)) lo = angle
      else hi = angle
    }
    const angle = (lo + hi) / 2
    return { angle, ...point(angle) }
  })
  for (let n = 0; n <= 24; n++) {
    const angle = entryStart + ((entryEnd - entryStart) * n) / 24
    const r = entryCenterR + entryRadius * Math.cos(angle),
      z = entryCenterZ + entryRadius * Math.sin(angle)
    const clip = (theta: number) =>
      entryClips[Math.round((theta * segments) / (2 * Math.PI)) % segments]!
    add(
      (theta) => (angle <= clip(theta).angle ? clip(theta).r : r),
      (theta) => (angle <= clip(theta).angle ? clip(theta).z : z),
    )
  }
  const floor = p.recessReferencePlaneHeight - totalDepth
  // Keep the nominal g junction explicit; f/t1 remain standard reference limits.
  const driveLevels = new Set<number>([p.recessReferencePlaneHeight - tg])
  for (let n = 1; n < 48; n++)
    driveLevels.add(wallZ + ((floor - wallZ) * n) / 48)
  for (const z of [...driveLevels]
    .filter((z) => z < wallZ && z > floor)
    .sort((a, b) => b - a)) {
    add((theta) => recessRadius(z, theta), z)
  }
  const point = vertex(0, 0, floor)
  for (let i = 0; i < segments; i++)
    triangle(point, previous[i]!, previous[(i + 1) % segments]!)

  return { positions, indices }
}
