import earcut from "earcut"
import {
  getLinearBearingBlockDimensions,
  type LinearBearingBlockModelPropsInput,
} from "@tscircuit/modelprinter"

export interface LinearBearingBlockMeshPart {
  name: string
  color: string
  mesh: { positions: number[]; indices: number[] }
  center?: [number, number, number]
  radius?: number
}
export interface LinearBearingBlockMesh {
  positions: number[]
  indices: number[]
  parts: LinearBearingBlockMeshPart[]
}
export type LinearBearingBlockMeshOptions = { segments?: number }

/** Housing datum Z=0; shaft axis Y at Z=height/2; four genuine vertical through holes. */
export function createLinearBearingBlockMesh(
  input: LinearBearingBlockModelPropsInput = {},
  options: LinearBearingBlockMeshOptions = {},
): LinearBearingBlockMesh {
  const d = getLinearBearingBlockDimensions(input)
  const segments = segmentsFor(options.segments)
  checkPrecision([
    d.boreRadius,
    d.length,
    d.height,
    d.width,
    d.cartridgeRadius - d.boreRadius,
    d.ballRadius,
    d.mountHoleDiameter,
  ])
  const cartridge = sleeveParts(
    { ...d, outerRadius: d.cartridgeRadius },
    segments,
  )
  // Share the actual refined mating ring. Differently sampled circles overlap
  // at their chords even when both nominal radii are identical.
  const shell = cartridge[0]!.mesh
  const matingRing: [number, number][] = []
  for (let i = 0; i < shell.positions.length; i += 3) {
    if (shell.positions[i + 2] !== 0) break
    matingRing.push([
      shell.positions[i]!,
      d.shaftHeight - shell.positions[i + 1]!,
    ])
  }
  const parts: LinearBearingBlockMeshPart[] = [
    {
      name: "housing",
      color: "#bbc0c5",
      mesh: housing(d, segments, matingRing),
    },
  ]
  for (const part of cartridge) {
    for (let i = 0; i < part.mesh.positions.length; i += 3) {
      const radialY = part.mesh.positions[i + 1]!,
        z = part.mesh.positions[i + 2]!
      part.mesh.positions[i + 1] = z - d.length / 2
      part.mesh.positions[i + 2] = d.shaftHeight - radialY
    }
    if (part.center)
      part.center = [
        part.center[0],
        part.center[2] - d.length / 2,
        d.shaftHeight - part.center[1],
      ]
    parts.push(part)
  }
  return { ...combine(parts), parts }
}

function housing(
  d: ReturnType<typeof getLinearBearingBlockDimensions>,
  segments: number,
  bore: [number, number][],
): Mesh {
  const positions: number[] = [],
    indices: number[] = []
  const lookup = new Map<string, number>()
  const vertex = (point: Point) => {
    const key = point
      .map((v) => (Math.abs(v) < 1e-13 ? "0" : v.toPrecision(14)))
      .join(",")
    const prior = lookup.get(key)
    if (prior !== undefined) return prior
    const index = positions.length / 3
    positions.push(...point)
    lookup.set(key, index)
    return index
  }
  const quad = (a: Point, b: Point, c: Point, e: Point) => {
    const v = [a, b, c, e].map(vertex)
    indices.push(v[0]!, v[1]!, v[2]!, v[0]!, v[2]!, v[3]!)
  }
  const face = (
    outer: [number, number][],
    holes: [number, number][][],
    to3: (p: [number, number]) => Point,
    normal: Point,
  ) => {
    const flat = [...outer, ...holes.flat()]
    const offsets: number[] = []
    let count = outer.length
    for (const hole of holes) {
      offsets.push(count)
      count += hole.length
    }
    const triangulation = earcut(flat.flat(), offsets, 2)
    const vertices = flat.map((point) => vertex(to3(point)))
    for (let i = 0; i < triangulation.length; i += 3) {
      const a = vertices[triangulation[i]!]!,
        b = vertices[triangulation[i + 1]!]!,
        c = vertices[triangulation[i + 2]!]!
      const ab = [
        positions[3 * b]! - positions[3 * a]!,
        positions[3 * b + 1]! - positions[3 * a + 1]!,
        positions[3 * b + 2]! - positions[3 * a + 2]!,
      ]
      const ac = [
        positions[3 * c]! - positions[3 * a]!,
        positions[3 * c + 1]! - positions[3 * a + 1]!,
        positions[3 * c + 2]! - positions[3 * a + 2]!,
      ]
      const dot =
        (ab[1]! * ac[2]! - ab[2]! * ac[1]!) * normal[0] +
        (ab[2]! * ac[0]! - ab[0]! * ac[2]!) * normal[1] +
        (ab[0]! * ac[1]! - ab[1]! * ac[0]!) * normal[2]
      if (dot > 0) indices.push(a, b, c)
      else indices.push(a, c, b)
    }
  }
  const x = d.width / 2,
    y = d.length / 2,
    h = d.height
  const rings = d.mountingCenters.map(([cx, cy]) =>
    Array.from({ length: segments }, (_, i): [number, number] => [
      cx + (d.mountHoleDiameter / 2) * Math.cos((i * Math.PI * 2) / segments),
      cy + (d.mountHoleDiameter / 2) * Math.sin((i * Math.PI * 2) / segments),
    ]),
  )
  const top: [number, number][] = [
    [-x, -y],
    [x, -y],
    [x, y],
    [-x, y],
  ]
  face(top, rings, ([a, b]) => [a, b, 0], [0, 0, -1])
  face(top, rings, ([a, b]) => [a, b, h], [0, 0, 1])
  for (const ring of rings)
    for (let i = 0; i < segments; i++) {
      const a = ring[i]!,
        b = ring[(i + 1) % segments]!
      quad([a[0], a[1], 0], [a[0], a[1], h], [b[0], b[1], h], [b[0], b[1], 0])
    }
  const front: [number, number][] = [
    [-x, 0],
    [x, 0],
    [x, h],
    [-x, h],
  ]
  face(front, [bore], ([a, b]) => [a, -y, b], [0, -1, 0])
  face(front, [bore], ([a, b]) => [a, y, b], [0, 1, 0])
  for (let i = 0; i < bore.length; i++) {
    const a = bore[i]!,
      b = bore[(i + 1) % bore.length]!
    // The cartridge's rotation makes this ring clockwise in X/Z.
    quad([a[0], -y, a[1]], [a[0], y, a[1]], [b[0], y, b[1]], [b[0], -y, b[1]])
  }
  quad([x, -y, 0], [x, y, 0], [x, y, h], [x, -y, h])
  quad([-x, y, 0], [-x, -y, 0], [-x, -y, h], [-x, y, h])
  return { positions, indices }
}

function sleeveParts(
  d: {
    boreRadius: number
    outerRadius: number
    length: number
    ballRadius: number
    loadedRadius: number
    returnRadius: number
    trackCount: number
    ballsPerRow: number
    grooveRadius: number
    straightSleeveInnerRadius: number
    endChamberRadius: number
    sealThickness: number
    rowStart: number
    rowEnd: number
    turnRadius: number
    cageInnerRadius: number
    cageOuterRadius: number
    cageStart: number
    cageEnd: number
    cageSectorHalfAngle: number
    returnCageOuterRadius: number
    returnCageHalfAngle: number
  },
  segments: number,
): LinearBearingBlockMeshPart[] {
  const groove = (angle: number) => {
    let radius = d.straightSleeveInnerRadius
    for (let row = 0; row < d.trackCount; row++)
      for (const returning of [false, true]) {
        const phase =
          ((row + (returning ? 0.5 : 0)) * Math.PI * 2) / d.trackCount
        const center = returning ? d.returnRadius : d.loadedRadius
        const perpendicular = center * Math.sin(angle - phase)
        const projected = center * Math.cos(angle - phase)
        if (projected > 0 && Math.abs(perpendicular) < d.grooveRadius)
          radius = Math.max(
            radius,
            projected + Math.sqrt(d.grooveRadius ** 2 - perpendicular ** 2),
          )
      }
    return radius
  }
  // Feature angles follow each actual groove circle. This bounds each local
  // arc step to 15 degrees, including narrow grooves in large custom bores;
  // a uniform shaft-angle grid alone can chord through a return ball.
  const angles = Array.from(
    { length: segments },
    (_, i) => (i * Math.PI * 2) / segments,
  )
  for (let row = 0; row < d.trackCount; row++)
    for (const returning of [false, true]) {
      const phase = ((row + (returning ? 0.5 : 0)) * Math.PI * 2) / d.trackCount
      const center = returning ? d.returnRadius : d.loadedRadius
      const cosine =
        (d.straightSleeveInnerRadius ** 2 - center ** 2 - d.grooveRadius ** 2) /
        (2 * center * d.grooveRadius)
      const limit = Math.acos(Math.max(-1, Math.min(1, cosine)))
      const steps = Math.max(2, Math.ceil((2 * limit) / (Math.PI / 12)))
      for (let i = 0; i <= steps; i++) {
        const local = -limit + (2 * limit * i) / steps
        const angle =
          phase +
          Math.atan2(
            d.grooveRadius * Math.sin(local),
            center + d.grooveRadius * Math.cos(local),
          )
        angles.push((angle + Math.PI * 2) % (Math.PI * 2))
      }
    }
  angles.sort((a, b) => a - b)
  const featureAngles = angles.filter(
    (angle, i) => i === 0 || angle - angles[i - 1]! > 1e-11,
  )
  const profile: ProfilePoint[] = [
    [d.outerRadius, 0],
    [d.outerRadius, d.length],
    [d.endChamberRadius, d.length],
    [d.endChamberRadius, d.cageEnd],
    [groove, d.cageEnd],
    [groove, d.cageStart],
    [d.endChamberRadius, d.cageStart],
    [d.endChamberRadius, 0],
  ]
  const parts: LinearBearingBlockMeshPart[] = [
    {
      name: "grooved steel sleeve",
      color: "#9da4ac",
      mesh: revolve(profile, featureAngles),
    },
  ]
  for (let row = 0; row < d.trackCount; row++) {
    const phase = (row * Math.PI * 2) / d.trackCount
    for (const returning of [false, true]) {
      const angle = phase + (returning ? Math.PI / d.trackCount : 0)
      const r = returning ? d.returnRadius : d.loadedRadius
      for (let i = 0; i < d.ballsPerRow; i++) {
        const z =
          d.rowStart + ((d.rowEnd - d.rowStart) * i) / (d.ballsPerRow - 1)
        const center: Point = [r * Math.cos(angle), r * Math.sin(angle), z]
        parts.push({
          name: `${returning ? "return" : "loaded"} row ${row + 1} ball ${i + 1}`,
          color: "#d5d9df",
          mesh: sphere(center, d.ballRadius),
          center,
          radius: d.ballRadius,
        })
      }
    }
    // One intermediate ball in each polar end-turn chamber. Its center never dips into the shaft.
    for (const sign of [-1, 1]) {
      const angle = phase + Math.PI / (2 * d.trackCount)
      const radius = (d.loadedRadius + d.returnRadius) / 2
      const center: Point = [
        radius * Math.cos(angle),
        radius * Math.sin(angle),
        sign < 0 ? d.rowStart - d.turnRadius : d.rowEnd + d.turnRadius,
      ]
      parts.push({
        name: `end-turn ${row + 1} ${sign}`,
        color: "#d5d9df",
        mesh: sphere(center, d.ballRadius),
        center,
        radius: d.ballRadius,
      })
    }
    const returnPhase = phase + Math.PI / d.trackCount
    parts.push({
      name: `return pocket floor ${row + 1}`,
      color: "#333c46",
      mesh: annularSector(
        d.cageInnerRadius,
        d.returnCageOuterRadius,
        d.cageStart,
        d.cageEnd,
        returnPhase - d.returnCageHalfAngle,
        returnPhase + d.returnCageHalfAngle,
        segments,
      ),
    })
    for (const half of [0.25, 0.75]) {
      const phase = ((row + half) * Math.PI * 2) / d.trackCount
      parts.push({
        name: `polymer pocket separator ${row + 1} ${half}`,
        color: "#333c46",
        mesh: annularSector(
          d.cageInnerRadius,
          d.cageOuterRadius,
          d.cageStart,
          d.cageEnd,
          phase - d.cageSectorHalfAngle,
          phase + d.cageSectorHalfAngle,
          segments,
        ),
      })
    }
  }
  for (const sign of [-1, 1]) {
    const z0 = sign < 0 ? 0 : d.length - d.sealThickness
    const z1 = sign < 0 ? d.sealThickness : d.length
    parts.push({
      name: `end retainer ${sign}`,
      color: "#333c46",
      mesh: revolve(
        [
          [d.endChamberRadius, z0],
          [d.endChamberRadius, z1],
          [d.boreRadius + 0.08 * d.ballRadius, z1],
          [d.boreRadius + 0.08 * d.ballRadius, z0],
        ],
        segments,
      ),
    })
  }
  return parts
}

type ProfilePoint = [number | ((angle: number) => number), number]
type Point = [number, number, number]
type Mesh = { positions: number[]; indices: number[] }

function segmentsFor(value = 96) {
  if (!Number.isInteger(value) || value < 96 || value > 192 || value % 24 !== 0)
    throw new Error("Segments must be a multiple of 24 from 96 to 192")
  return value
}
function checkPrecision(lengths: number[]) {
  const largest = Math.max(...lengths)
  if (
    !lengths.every(Number.isFinite) ||
    largest > 1e6 ||
    Math.min(...lengths) < Math.max(1e-5, largest * 1e-7)
  )
    throw new Error(
      "Bearing dimensions exceed the renderer's numerical resolution",
    )
}
/** Closed outward section, outside upward and bore downward; never a center cap. */
function revolve(profile: ProfilePoint[], resolution: number | number[]): Mesh {
  const angles =
    typeof resolution === "number"
      ? Array.from(
          { length: resolution },
          (_, i) => (i * Math.PI * 2) / resolution,
        )
      : resolution
  const segments = angles.length
  const positions: number[] = []
  const indices: number[] = []
  for (const [radius, z] of profile)
    for (let i = 0; i < segments; i++) {
      const angle = angles[i]!
      const r = typeof radius === "number" ? radius : radius(angle)
      positions.push(r * Math.cos(angle), r * Math.sin(angle), z)
    }
  for (let j = 0; j < profile.length; j++)
    for (let i = 0; i < segments; i++) {
      const a = j * segments + i
      const b = j * segments + ((i + 1) % segments)
      const c = ((j + 1) % profile.length) * segments + ((i + 1) % segments)
      const e = ((j + 1) % profile.length) * segments + i
      indices.push(a, b, c, a, c, e)
    }
  return { positions, indices }
}
function annularSector(
  inner: number,
  outer: number,
  z0: number,
  z1: number,
  start: number,
  end: number,
  segments: number,
): Mesh {
  const steps = Math.max(
    2,
    Math.ceil(((end - start) / (2 * Math.PI)) * segments),
  )
  const count = steps + 1
  const profile: [number, number][] = [
    [outer, z0],
    [outer, z1],
    [inner, z1],
    [inner, z0],
  ]
  const positions: number[] = []
  const indices: number[] = []
  for (const [r, z] of profile)
    for (let i = 0; i <= steps; i++) {
      const angle = start + ((end - start) * i) / steps
      positions.push(r * Math.cos(angle), r * Math.sin(angle), z)
    }
  for (let j = 0; j < 4; j++)
    for (let i = 0; i < steps; i++) {
      const a = j * count + i
      const b = a + 1
      const c = ((j + 1) % 4) * count + i + 1
      const e = ((j + 1) % 4) * count + i
      indices.push(a, b, c, a, c, e)
    }
  indices.push(0, count, 2 * count, 0, 2 * count, 3 * count)
  const a = steps,
    b = count + steps,
    c = 2 * count + steps,
    e = 3 * count + steps
  indices.push(a, c, b, a, e, c)
  return { positions, indices }
}
/** Single pole vertices prevent collapsed triangles and nonmanifold pole seams. */
function sphere(center: Point, radius: number): Mesh {
  const longitude = 24
  const latitude = 12
  const positions = [center[0], center[1], center[2] + radius]
  const indices: number[] = []
  for (let j = 1; j < latitude; j++) {
    const polar = (j * Math.PI) / latitude
    for (let i = 0; i < longitude; i++) {
      const azimuth = (i * Math.PI * 2) / longitude
      positions.push(
        center[0] + radius * Math.sin(polar) * Math.cos(azimuth),
        center[1] + radius * Math.sin(polar) * Math.sin(azimuth),
        center[2] + radius * Math.cos(polar),
      )
    }
  }
  const south = positions.length / 3
  positions.push(center[0], center[1], center[2] - radius)
  for (let i = 0; i < longitude; i++) {
    const next = (i + 1) % longitude
    indices.push(0, 1 + i, 1 + next)
    for (let j = 0; j < latitude - 2; j++) {
      const a = 1 + j * longitude + i,
        b = 1 + (j + 1) * longitude + i
      const c = 1 + (j + 1) * longitude + next,
        e = 1 + j * longitude + next
      indices.push(a, b, c, a, c, e)
    }
    const last = 1 + (latitude - 2) * longitude
    indices.push(south, last + next, last + i)
  }
  return { positions, indices }
}
function combine(parts: { mesh: Mesh }[]): Mesh {
  const positions: number[] = []
  const indices: number[] = []
  for (const { mesh } of parts) {
    const offset = positions.length / 3
    positions.push(...mesh.positions)
    indices.push(...mesh.indices.map((index) => index + offset))
  }
  return { positions, indices }
}
