import {
  getThrustBallBearingDimensions,
  type ThrustBallBearingModelPropsInput,
} from "@tscircuit/modelprinter"
import earcut from "earcut"

export interface ThrustBallBearingMesh {
  positions: number[]
  indices: number[]
}

export interface ThrustBallBearingMeshOptions {
  /** Angular subdivisions, a multiple of four from 24 through 192. */
  segments?: number
}

export interface ThrustBallBearingMeshPart extends ThrustBallBearingMesh {
  kind: "lowerwasher" | "upperwasher" | "cage" | "ball"
}

function revolve(profile: [number, number][], segments: number) {
  const positions: number[] = []
  const indices: number[] = []
  for (const [radius, z] of profile)
    for (let i = 0; i < segments; i++) {
      const angle = (i * Math.PI * 2) / segments
      positions.push(radius * Math.cos(angle), radius * Math.sin(angle), z)
    }
  for (let ring = 0; ring < profile.length; ring++) {
    const a = ring * segments
    const b = ((ring + 1) % profile.length) * segments
    for (let i = 0; i < segments; i++) {
      const next = (i + 1) % segments
      indices.push(a + i, a + next, b + next, a + i, b + next, b + i)
    }
  }
  return { positions, indices }
}

function sphere(
  center: [number, number, number],
  radius: number,
  segments: number,
) {
  const stacks = segments / 2
  const positions = [center[0], center[1], center[2] + radius]
  const indices: number[] = []
  for (let row = 1; row < stacks; row++) {
    const latitude = (row * Math.PI) / stacks
    for (let i = 0; i < segments; i++) {
      const angle = (i * Math.PI * 2) / segments
      positions.push(
        center[0] + radius * Math.sin(latitude) * Math.cos(angle),
        center[1] + radius * Math.sin(latitude) * Math.sin(angle),
        center[2] + radius * Math.cos(latitude),
      )
    }
  }
  const south = positions.length / 3
  positions.push(center[0], center[1], center[2] - radius)
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments
    indices.push(0, 1 + i, 1 + next)
    for (let row = 0; row < stacks - 2; row++) {
      const a = 1 + row * segments
      const b = a + segments
      indices.push(a + i, b + i, b + next, a + i, b + next, a + next)
    }
    const a = 1 + (stacks - 2) * segments
    indices.push(a + i, south, a + next)
  }
  return { positions, indices }
}

function cage(
  d: ReturnType<typeof getThrustBallBearingDimensions>,
  segments: number,
) {
  const planar: number[] = []
  const holeIndices: number[] = []
  const loops: { start: number; count: number }[] = []
  const circle = (
    radius: number,
    x: number,
    y: number,
    count: number,
    clockwise: boolean,
  ) => {
    const start = planar.length / 2
    if (start > 0) holeIndices.push(start)
    loops.push({ start, count })
    for (let i = 0; i < count; i++) {
      const angle = ((clockwise ? -1 : 1) * i * Math.PI * 2) / count
      planar.push(x + radius * Math.cos(angle), y + radius * Math.sin(angle))
    }
  }
  circle(d.cageOuterRadius, 0, 0, segments, false)
  circle(d.cageInnerRadius, 0, 0, segments, true)
  for (let i = 0; i < d.ballCount; i++) {
    const angle = (i * Math.PI * 2) / d.ballCount
    circle(
      d.cagePocketRadius,
      d.pitchRadius * Math.cos(angle),
      d.pitchRadius * Math.sin(angle),
      Math.max(12, segments / 4),
      true,
    )
  }
  const count = planar.length / 2
  const positions: number[] = []
  for (const z of [
    d.ballCenterZ - d.cageThickness / 2,
    d.ballCenterZ + d.cageThickness / 2,
  ])
    for (let i = 0; i < count; i++)
      positions.push(planar[2 * i]!, planar[2 * i + 1]!, z)
  const indices: number[] = []
  const faces = earcut(planar, holeIndices, 2)
  for (let i = 0; i < faces.length; i += 3) {
    let [a, b, c] = faces.slice(i, i + 3) as [number, number, number]
    const cross =
      (planar[2 * b]! - planar[2 * a]!) *
        (planar[2 * c + 1]! - planar[2 * a + 1]!) -
      (planar[2 * b + 1]! - planar[2 * a + 1]!) *
        (planar[2 * c]! - planar[2 * a]!)
    if (cross < 0) [b, c] = [c, b]
    indices.push(a, c, b, a + count, b + count, c + count)
  }
  for (const loop of loops)
    for (let i = 0; i < loop.count; i++) {
      const a = loop.start + i
      const b = loop.start + ((i + 1) % loop.count)
      indices.push(a, b, b + count, a, b + count, a + count)
    }
  return { positions, indices }
}

/** Separate closed solids, nominal grooved washers, cage pockets and real balls. */
export function createThrustBallBearingMeshParts(
  input: ThrustBallBearingModelPropsInput = {},
  options: ThrustBallBearingMeshOptions = {},
): ThrustBallBearingMeshPart[] {
  const segments = options.segments ?? 96
  if (
    !Number.isInteger(segments) ||
    segments < 24 ||
    segments > 192 ||
    segments % 4 !== 0
  )
    throw new Error(
      "Thrust bearing segments must be a multiple of four from 24 through 192",
    )
  const d = getThrustBallBearingDimensions(input)
  if (![...Object.values(d)].every(Number.isFinite) || d.ballRadius <= 0)
    throw new Error("Thrust bearing envelope is outside the finite mesh range")
  const profile: [number, number][] = [
    [d.outerRadius, 0],
    [d.outerRadius, d.washerThickness],
  ]
  const halfAngle = Math.asin((d.ballRadius * 0.82) / d.grooveRadius)
  const grooveSteps = 24
  for (let i = 0; i <= grooveSteps; i++) {
    const angle = -halfAngle - ((Math.PI - 2 * halfAngle) * i) / grooveSteps
    profile.push([
      d.pitchRadius + d.grooveRadius * Math.cos(angle),
      d.ballCenterZ + d.grooveRadius * Math.sin(angle),
    ])
  }
  profile.push([d.innerRadius, d.washerThickness], [d.innerRadius, 0])
  const lower = revolve(profile, segments)
  const upper = revolve(
    profile.map(([r, z]) => [r, d.height - z]),
    segments,
  )
  // Mirroring the upper washer reverses orientation; restore outward winding.
  for (let i = 0; i < upper.indices.length; i += 3)
    [upper.indices[i + 1], upper.indices[i + 2]] = [
      upper.indices[i + 2]!,
      upper.indices[i + 1]!,
    ]
  const parts: ThrustBallBearingMeshPart[] = [
    { kind: "lowerwasher", ...lower },
    { kind: "upperwasher", ...upper },
    { kind: "cage", ...cage(d, segments) },
  ]
  // A fixed bounded ball mesh is enough for the small race spheres; no CSG.
  for (let i = 0; i < d.ballCount; i++) {
    const angle = (i * Math.PI * 2) / d.ballCount
    parts.push({
      kind: "ball",
      ...sphere(
        [
          d.pitchRadius * Math.cos(angle),
          d.pitchRadius * Math.sin(angle),
          d.ballCenterZ,
        ],
        d.ballRadius,
        Math.max(24, segments / 2 - ((segments / 2) % 4)),
      ),
    })
  }
  return parts
}

/** Joined indexed data for snapshots/conversion; solids retain separate shells. */
export function createThrustBallBearingMesh(
  input: ThrustBallBearingModelPropsInput = {},
  options: ThrustBallBearingMeshOptions = {},
): ThrustBallBearingMesh {
  const positions: number[] = []
  const indices: number[] = []
  for (const part of createThrustBallBearingMeshParts(input, options)) {
    const offset = positions.length / 3
    positions.push(...part.positions)
    indices.push(...part.indices.map((index) => index + offset))
  }
  return { positions, indices }
}
