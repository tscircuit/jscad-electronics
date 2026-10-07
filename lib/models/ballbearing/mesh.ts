import {
  getBallBearingDimensions,
  type BallBearingModelPropsInput,
} from "@tscircuit/modelprinter"

export interface BallBearingMeshPart {
  name: string
  color: string
  mesh: { positions: number[]; indices: number[] }
  /** Only rolling elements have centers/radii; useful to inspect nominal contact. */
  center?: [number, number, number]
  radius?: number
}
export interface BallBearingMesh {
  positions: number[]
  indices: number[]
  parts: BallBearingMeshPart[]
}
export type BallBearingMeshOptions = { segments?: number }

/** ISO/de-facto envelope, nominal grooved races/balls/cage, and both optional closures. */
export function createBallBearingMesh(
  input: BallBearingModelPropsInput = {},
  options: BallBearingMeshOptions = {},
): BallBearingMesh {
  const d = getBallBearingDimensions(input)
  const segments = segmentsFor(options.segments)
  checkPrecision([
    d.outerDiameter,
    d.boreRadius,
    d.width,
    d.outerRadius - d.boreRadius,
    d.ballRadius,
  ])
  const c = d.rimChamfer,
    mid = d.midZ,
    half = d.grooveHalfWidth
  const innerProfile: ProfilePoint[] = [
    [d.innerRaceOuterRadius - c, 0],
    [d.innerRaceOuterRadius, c],
  ]
  for (let i = 0; i <= 24; i++) {
    const z = mid - half + (2 * half * i) / 24
    innerProfile.push([
      d.pitchRadius -
        Math.sqrt(Math.max(0, d.grooveRadius ** 2 - (z - mid) ** 2)),
      z,
    ])
  }
  innerProfile.push(
    [d.innerRaceOuterRadius, d.width - c],
    [d.innerRaceOuterRadius - c, d.width],
    [d.boreRadius + c, d.width],
    [d.boreRadius, d.width - c],
    [d.boreRadius, c],
    [d.boreRadius + c, 0],
  )
  const outerProfile: ProfilePoint[] = [
    [d.outerRadius - c, 0],
    [d.outerRadius, c],
    [d.outerRadius, d.width - c],
    [d.outerRadius - c, d.width],
    [d.outerRaceInnerRadius + c, d.width],
    [d.outerRaceInnerRadius, d.width - c],
  ]
  for (let i = 0; i <= 24; i++) {
    const z = mid + half - (2 * half * i) / 24
    outerProfile.push([
      d.pitchRadius +
        Math.sqrt(Math.max(0, d.grooveRadius ** 2 - (z - mid) ** 2)),
      z,
    ])
  }
  outerProfile.push(
    [d.outerRaceInnerRadius, c],
    [d.outerRaceInnerRadius + c, 0],
  )
  const parts: BallBearingMeshPart[] = [
    {
      name: "inner race",
      color: "#9da4ac",
      mesh: revolve(innerProfile, segments),
    },
    {
      name: "outer race",
      color: "#9da4ac",
      mesh: revolve(outerProfile, segments),
    },
  ]
  for (let i = 0; i < d.ballCount; i++) {
    const phase = (i * Math.PI * 2) / d.ballCount
    const center: Point = [
      d.pitchRadius * Math.cos(phase),
      d.pitchRadius * Math.sin(phase),
      mid,
    ]
    parts.push({
      name: `ball ${i + 1}`,
      color: "#d5d9df",
      mesh: sphere(center, d.ballRadius),
      center,
      radius: d.ballRadius,
    })
    const separator = ((i + 0.5) * Math.PI * 2) / d.ballCount
    parts.push({
      name: `cage separator ${i + 1}`,
      color: "#b89b58",
      mesh: annularSector(
        d.cageInnerRadius,
        d.cageOuterRadius,
        mid - 1.1 * d.ballRadius,
        mid + 1.1 * d.ballRadius,
        separator - d.cageSeparatorHalfAngle,
        separator + d.cageSeparatorHalfAngle,
        segments,
      ),
    })
  }
  for (const sign of [-1, 1]) {
    const z0 = mid + (sign === -1 ? -1.25 : 1.1) * d.ballRadius
    const z1 = mid + (sign === -1 ? -1.1 : 1.25) * d.ballRadius
    parts.push({
      name: `cage ${sign < 0 ? "lower" : "upper"} band`,
      color: "#b89b58",
      mesh: revolve(
        [
          [d.cageOuterRadius, z0],
          [d.cageOuterRadius, z1],
          [d.cageInnerRadius, z1],
          [d.cageInnerRadius, z0],
        ],
        segments,
      ),
    })
  }
  if (d.closure !== "open")
    for (const sign of [-1, 1]) {
      const t = d.closureThickness
      const ri = d.innerRaceOuterRadius,
        ro = d.outerRaceInnerRadius
      const shape: [number, number][] =
        d.closure === "shielded"
          ? [
              [ro, 0],
              [ro, t * 0.45],
              [ri, t * 0.45],
              [ri, 0],
            ]
          : [
              [ro, 0],
              [ro, t],
              [ri, t],
              [ri, 0],
              [ri + 0.15 * (ro - ri), 0.5 * t],
              [ro - 0.15 * (ro - ri), 0.5 * t],
            ]
      const profile: ProfilePoint[] =
        sign === -1
          ? shape
          : shape.map(([r, z]) => [r, d.width - z] as ProfilePoint).reverse()
      parts.push({
        name: `${d.closure} ${sign < 0 ? "lower" : "upper"}`,
        color: d.closure === "sealed" ? "#252a30" : "#b5bbc3",
        mesh: revolve(profile, segments),
      })
    }
  return { ...combine(parts), parts }
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
function revolve(profile: ProfilePoint[], segments: number): Mesh {
  const positions: number[] = []
  const indices: number[] = []
  for (const [radius, z] of profile)
    for (let i = 0; i < segments; i++) {
      const angle = (i * Math.PI * 2) / segments
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
