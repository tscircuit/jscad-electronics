import {
  buttonScrewModelPropsSchema,
  getButtonScrewDimensions,
  type ButtonScrewModelPropsInput,
} from "@tscircuit/modelprinter"

/** Indexed counterclockwise triangles in millimeters. */
export interface ButtonScrewMesh {
  positions: number[]
  indices: number[]
}
/** Renderer resolution affects tessellation only, never model specifications. */
export interface ButtonScrewMeshOptions {
  radialSegments?: number
  segmentsPerPitch?: number
}
function resolution(options: ButtonScrewMeshOptions) {
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
/** Closed nominal surface: bearing z=0, tip -length, blind hex socket above. */
export function createButtonScrewMesh(
  input: ButtonScrewModelPropsInput,
  options: ButtonScrewMeshOptions = {},
): ButtonScrewMesh {
  const props = buttonScrewModelPropsSchema.parse(input)
  const d = getButtonScrewDimensions(input)
  const { radial, axial } = resolution(options)
  const steps = Math.max(2, Math.ceil((props.length / d.threadPitch) * axial))
  if (steps > 24000 || !Number.isFinite(steps))
    throw new Error("Mesh resolution limit: too many thread turns")
  const m = surface(radial)
  const radius = d.diameter / 2
  const depth = (d.diameter - d.threadMinorDiameter) / 2
  const fillet = d.underHeadRadius
  const levels = new Set<number>(
    props.showThreads
      ? Array.from(
          { length: steps + 1 },
          (_, i) => -props.length + (props.length * i) / steps,
        )
      : [-props.length, 0],
  )
  levels.add(-props.length + d.tipChamfer)
  levels.add(-d.threadPitch)
  for (let i = 0; i <= 16; i++)
    levels.add(-fillet + fillet * Math.sin((i * Math.PI) / 32))
  let previous = -1
  const shaftLevels = [...levels]
    .sort((a, b) => a - b)
    .filter((z, index, sorted) => index === 0 || z - sorted[index - 1]! > 1e-10)
  for (const z of shaftLevels) {
    const current = m.ring(z, (angle) => {
      const envelope =
        z >= -fillet
          ? radius +
            fillet -
            Math.sqrt(Math.max(0, fillet ** 2 - (z + fillet) ** 2))
          : radius
      const groove = Math.min(
        depth,
        Math.max(
          0,
          (threadDistance(z + props.length, angle, d.threadPitch) - 1 / 16) *
            d.threadPitch *
            Math.sqrt(3),
        ),
      )
      const threaded =
        envelope -
        (props.showThreads ? groove * Math.min(1, -z / d.threadPitch) : 0)
      const tip =
        z + props.length < d.tipChamfer
          ? radius - (d.tipChamfer - (z + props.length))
          : Infinity
      return Math.min(threaded, tip)
    })
    if (previous < 0) m.cap(current, z, false)
    else m.connect(previous, current)
    previous = current
  }
  const add = (z: number, radiusAt: (angle: number) => number) => {
    const current = m.ring(z, radiusAt)
    m.connect(previous, current)
    previous = current
  }
  add(0, () => d.headDiameter / 2)
  for (let i = 1; i <= 24; i++) {
    const z = (d.headHeight * i) / 24
    add(
      z,
      () =>
        d.crownArcCenterR +
        Math.sqrt(
          Math.max(0, d.crownRadius ** 2 - (z - d.crownArcCenterZ) ** 2),
        ),
    )
  }
  add(d.topZ, (angle) => hexRadius(angle, d.socketWidth))
  add(d.topZ - d.socketDepth, (angle) => hexRadius(angle, d.socketWidth))
  m.cap(previous, d.topZ - d.socketDepth, true)
  return { positions: m.positions, indices: m.indices }
}
