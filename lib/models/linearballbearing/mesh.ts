import {
  getLinearBallBearingDimensions,
  type LinearBallBearingModelPropsInput,
} from "@tscircuit/modelprinter"

export interface LinearBallBearingMeshPart {
  name: string
  color: string
  mesh: { positions: number[]; indices: number[] }
  center?: [number, number, number]
  radius?: number
}
export interface LinearBallBearingMesh {
  positions: number[]
  indices: number[]
  parts: LinearBallBearingMeshPart[]
}
export type LinearBallBearingMeshOptions = { segments?: number }

/** Generic sleeve with loaded/return balls, grooved sleeve, cage and two end retainers. */
export function createLinearBallBearingMesh(
  input: LinearBallBearingModelPropsInput = {},
  options: LinearBallBearingMeshOptions = {},
): LinearBallBearingMesh {
  const d = getLinearBallBearingDimensions(input)
  const segments = segmentsFor(options.segments)
  checkPrecision([
    d.outerDiameter,
    d.boreRadius,
    d.length,
    d.outerRadius - d.boreRadius,
    d.ballRadius,
  ])
  const parts = sleeveParts(d, segments)
  return { ...combine(parts), parts }
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
): LinearBallBearingMeshPart[] {
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
  const parts: LinearBallBearingMeshPart[] = [
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
