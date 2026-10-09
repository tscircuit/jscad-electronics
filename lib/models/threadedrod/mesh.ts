import {
  threadedRodModelPropsSchema,
  getThreadedRodDimensions,
  type ThreadedRodModelPropsInput,
} from "@tscircuit/modelprinter"

/** Indexed counterclockwise triangles in millimeters. */
export interface ThreadedRodMesh {
  positions: number[]
  indices: number[]
}
/** Renderer resolution affects tessellation only, never model specifications. */
export interface ThreadedRodMeshOptions {
  radialSegments?: number
  segmentsPerPitch?: number
}
function resolution(options: ThreadedRodMeshOptions) {
  const radial = options.radialSegments ?? 96
  const axial = options.segmentsPerPitch ?? 32
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
  const cap = (start: number, z: number, up: boolean) => {
    const center = positions.length / 3
    positions.push(0, 0, z)
    for (let i = 0; i < segments; i++) {
      const n = (i + 1) % segments
      indices.push(center, start + (up ? i : n), start + (up ? n : i))
    }
  }
  return { positions, indices, ring, connect, cap }
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
/** Full single-start external thread, phase +X at z=0, flat chamfered ends. */
export function createThreadedRodMesh(
  input: ThreadedRodModelPropsInput,
  options: ThreadedRodMeshOptions = {},
): ThreadedRodMesh {
  const props = threadedRodModelPropsSchema.parse(input)
  const d = getThreadedRodDimensions(input)
  const { radial, axial } = resolution(options)
  const steps = Math.max(2, Math.ceil((d.length / d.threadPitch) * axial))
  if (
    steps > 24000 ||
    !Number.isFinite(steps) ||
    Math.min(d.minorDiameter, d.endDiameter) < d.diameter * 1e-8
  )
    throw new Error(
      "Mesh resolution limit: excessive turns or vanishing end/root radius",
    )
  const m = surface(radial)
  const levels = new Set(
    Array.from({ length: steps + 1 }, (_, i) => (d.length * i) / steps),
  )
  levels.add(props.chamfer)
  levels.add(d.length - props.chamfer)
  const radius = d.diameter / 2,
    depth = (d.diameter - d.minorDiameter) / 2
  let previous = -1
  for (const z of [...levels].sort((a, b) => a - b)) {
    const current = m.ring(z, (angle) => {
      const groove = Math.min(
        depth,
        Math.max(
          0,
          (threadDistance(z, angle, d.threadPitch, props.leftHand ? -1 : 1) -
            1 / 16) *
            d.threadPitch *
            Math.sqrt(3),
        ),
      )
      const chamfer =
        radius - Math.max(0, props.chamfer - Math.min(z, d.length - z))
      return Math.min(radius - groove, chamfer)
    })
    if (previous < 0) m.cap(current, z, false)
    else m.connect(previous, current)
    previous = current
  }
  m.cap(previous, d.length, true)
  return { positions: m.positions, indices: m.indices }
}
