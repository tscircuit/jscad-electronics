import {
  femaleStandoffModelPropsSchema,
  getFemaleStandoffDimensions,
  type FemaleStandoffModelPropsInput,
} from "@tscircuit/modelprinter"

/** Indexed counterclockwise triangles in millimeters. */
export interface FemaleStandoffMesh {
  positions: number[]
  indices: number[]
}
/** Renderer resolution affects tessellation only, never model specifications. */
export interface FemaleStandoffMeshOptions {
  radialSegments?: number
  segmentsPerPitch?: number
}
function resolution(options: FemaleStandoffMeshOptions) {
  const radial = options.radialSegments ?? 48
  const axial = options.segmentsPerPitch ?? 16
  if (
    !Number.isInteger(radial) ||
    radial < 24 ||
    radial > 192 ||
    radial % 12 !== 0 ||
    !Number.isInteger(axial) ||
    axial < 8 ||
    axial > 64
  )
    throw new Error(
      "Mesh resolution limit: radial segments must be a multiple of 12 in [24,192], pitch segments an integer in [8,64]",
    )
  return { radial, axial }
}
function surface(segments: number) {
  const positions: number[] = [],
    indices: number[] = []
  const ring = (z: number, radius: (angle: number) => number) => {
    const start = positions.length / 3
    for (let i = 0; i < segments; i++) {
      const angle = (i * 2 * Math.PI) / segments
      const r = radius(angle)
      positions.push(r * Math.cos(angle), r * Math.sin(angle), z)
    }
    return start
  }
  const connect = (a: number, b: number) => {
    for (let i = 0; i < segments; i++) {
      const n = (i + 1) % segments
      indices.push(a + i, a + n, b + n, a + i, b + n, b + i)
    }
  }
  return { positions, indices, ring, connect }
}
function hexRadius(angle: number, acrossFlats: number) {
  const period = Math.PI / 3
  const distance =
    ((((angle - Math.PI / 2 + period / 2) % period) + period) % period) -
    period / 2
  return acrossFlats / 2 / Math.cos(distance)
}
function threadDistance(z: number, angle: number, pitch: number, hand = 1) {
  const phase = (((z / pitch - (hand * angle) / (2 * Math.PI)) % 1) + 1) % 1
  return Math.min(phase, 1 - phase)
}
/** Closed hex body with a through internal helix and two 45-degree bore mouths. */
export function createFemaleStandoffMesh(
  input: FemaleStandoffModelPropsInput,
  options: FemaleStandoffMeshOptions = {},
): FemaleStandoffMesh {
  const props = femaleStandoffModelPropsSchema.parse(input)
  const d = getFemaleStandoffDimensions(input)
  const { radial, axial } = resolution(options)
  const steps = Math.max(2, Math.ceil((d.length / d.threadPitch) * axial))
  if (steps > 24000 || !Number.isFinite(steps))
    throw new Error("Mesh resolution limit: too many thread turns")
  const m = surface(radial)
  const outer = (z: number, angle: number) => {
    const setback = Math.max(0, d.endChamfer - Math.min(z, d.length - z))
    return hexRadius(angle, d.acrossFlats - 2 * setback)
  }
  const outerZ = [0, d.endChamfer, d.length - d.endChamfer, d.length]
    .sort((a, b) => a - b)
    .filter((z, index, sorted) => index === 0 || z - sorted[index - 1]! > 1e-10)
  const first = m.ring(0, (angle) => outer(0, angle))
  let previous = first
  for (const z of outerZ.slice(1)) {
    const current = m.ring(z, (angle) => outer(z, angle))
    m.connect(previous, current)
    previous = current
  }
  const levels = new Set(
    props.showThreads
      ? Array.from({ length: steps + 1 }, (_, i) =>
          i === steps ? d.length : (d.length * i) / steps,
        )
      : [0, d.length],
  )
  levels.add(d.boreChamferDepth)
  levels.add(d.length - d.boreChamferDepth)
  const minor = d.boreMinorDiameter / 2
  const depth = (d.diameter - d.boreMinorDiameter) / 2
  for (const z of [...levels].sort((a, b) => b - a)) {
    const current = m.ring(z, (angle) => {
      const groove = Math.min(
        depth,
        Math.max(
          0,
          (threadDistance(z, angle, d.threadPitch, props.leftHand ? -1 : 1) -
            1 / 8) *
            d.threadPitch *
            Math.sqrt(3),
        ),
      )
      const threaded = minor + (props.showThreads ? groove : 0)
      return Math.max(threaded, d.mouthDiameter / 2 - Math.min(z, d.length - z))
    })
    m.connect(previous, current)
    previous = current
  }
  m.connect(previous, first)
  return { positions: m.positions, indices: m.indices }
}
