import {
  getMaleFemaleStandoffDimensions,
  type MaleFemaleStandoffModelPropsInput,
} from "@tscircuit/modelprinter"

/** Closed, outward-wound indexed triangles in millimeters. */
export interface MaleFemaleStandoffMesh {
  positions: number[]
  indices: number[]
}
export interface MaleFemaleStandoffMeshOptions {
  radialSegments?: number
  segmentsPerPitch?: number
}
function resolution(options: MaleFemaleStandoffMeshOptions) {
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
function hexRadius(angle: number, acrossFlats: number) {
  const period = Math.PI / 3
  const distance =
    ((((angle - Math.PI / 2 + period / 2) % period) + period) % period) -
    period / 2
  return acrossFlats / 2 / Math.cos(distance)
}
function threadDistance(z: number, angle: number, pitch: number, hand: number) {
  const phase = (((z / pitch - (hand * angle) / (2 * Math.PI)) % 1) + 1) % 1
  return Math.min(phase, 1 - phase)
}
/** Body above the lower shoulder; threaded male stud below; flat-floor blind socket above. */
export function createMaleFemaleStandoffMesh(
  input: MaleFemaleStandoffModelPropsInput,
  options: MaleFemaleStandoffMeshOptions = {},
): MaleFemaleStandoffMesh {
  const d = getMaleFemaleStandoffDimensions(input)
  const { radial, axial } = resolution(options)
  const studSteps = d.showThreads
    ? Math.max(2, Math.ceil((d.studLength / d.threadPitch) * axial))
    : 2
  const boreSteps = d.showThreads
    ? Math.max(2, Math.ceil((d.femaleDepth / d.threadPitch) * axial))
    : 2
  if (
    !Number.isFinite(studSteps + boreSteps) ||
    (studSteps + boreSteps + 12) * radial > 1000000 ||
    d.studTipDiameter < d.diameter * 1e-8
  )
    throw new Error(
      "Mesh resolution limit: excessive thread turns or a vanishing stud tip",
    )
  const positions: number[] = [],
    indices: number[] = []
  const ring = (z: number, radius: (angle: number) => number) => {
    const start = positions.length / 3
    for (let i = 0; i < radial; i++) {
      const angle = (i * 2 * Math.PI) / radial
      const r = radius(angle)
      positions.push(r * Math.cos(angle), r * Math.sin(angle), z)
    }
    return start
  }
  const connect = (a: number, b: number) => {
    for (let i = 0; i < radial; i++) {
      const n = (i + 1) % radial
      indices.push(a + i, a + n, b + n, a + i, b + n, b + i)
    }
  }
  const cap = (start: number, z: number, up: boolean) => {
    const center = positions.length / 3
    positions.push(0, 0, z)
    for (let i = 0; i < radial; i++) {
      const n = (i + 1) % radial
      indices.push(center, start + (up ? i : n), start + (up ? n : i))
    }
  }
  let previous = -1
  const add = (z: number, radius: (angle: number) => number) => {
    const current = ring(z, radius)
    if (previous < 0) cap(current, z, false)
    else connect(previous, current)
    previous = current
  }
  const hand = d.leftHand ? -1 : 1
  const studLevels = new Set(
    Array.from({ length: studSteps + 1 }, (_, i) =>
      i === studSteps ? 0 : d.studTipZ + (d.studLength * i) / studSteps,
    ),
  )
  studLevels.add(d.studTipZ + d.studChamferDepth)
  for (const z of [...studLevels].sort((a, b) => a - b))
    add(z, (angle) => {
      const groove = d.showThreads
        ? Math.min(
            (d.diameter - d.externalMinorDiameter) / 2,
            Math.max(
              0,
              (threadDistance(z, angle, d.threadPitch, hand) - 1 / 16) *
                d.threadPitch *
                Math.sqrt(3),
            ),
          )
        : 0
      return Math.min(
        d.diameter / 2 - groove,
        d.studTipDiameter / 2 + z - d.studTipZ,
      )
    })
  const bodyLevels = [
    ...new Set([0, d.bodyChamfer, d.length - d.bodyChamfer, d.length]),
  ].sort((a, b) => a - b)
  for (const z of bodyLevels)
    add(z, (angle) =>
      hexRadius(
        angle,
        d.acrossFlats -
          2 * Math.max(0, d.bodyChamfer - Math.min(z, d.length - z)),
      ),
    )
  const boreLevels = new Set(
    Array.from({ length: boreSteps + 1 }, (_, i) =>
      i === boreSteps
        ? d.boreFloorZ
        : d.length - (d.femaleDepth * i) / boreSteps,
    ),
  )
  boreLevels.add(d.length - d.boreChamferDepth)
  for (const z of [...boreLevels].sort((a, b) => b - a))
    add(z, (angle) => {
      const groove = d.showThreads
        ? Math.min(
            (d.diameter - d.boreMinorDiameter) / 2,
            Math.max(
              0,
              (threadDistance(z, angle, d.threadPitch, hand) - 1 / 8) *
                d.threadPitch *
                Math.sqrt(3),
            ),
          )
        : 0
      return Math.max(
        d.boreMinorDiameter / 2 + groove,
        d.mouthDiameter / 2 - (d.length - z),
      )
    })
  cap(previous, d.boreFloorZ, true)
  return { positions, indices }
}
