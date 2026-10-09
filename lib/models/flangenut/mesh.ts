import {
  flangeNutModelPropsSchema,
  getFlangeNutDimensions,
  type FlangeNutModelPropsInput,
} from "@tscircuit/modelprinter"

/** Welded, outward counterclockwise triangle surface in millimeters. */
export interface FlangeNutMesh {
  positions: number[]
  indices: number[]
}
/** Tessellation only; all model dimensions come from modelprinter. */
export interface FlangeNutMeshOptions {
  radialSegments?: number
  segmentsPerPitch?: number
}
function resolution(options: FlangeNutMeshOptions) {
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
function threadDistance(z: number, angle: number, pitch: number) {
  const phase = (((z / pitch - angle / (2 * Math.PI)) % 1) + 1) % 1
  return Math.min(phase, 1 - phase)
}

/** Single closed annular shell: flange, hexagon, entrances and internal thread.
 * The flange shares the hex body's vertices rather than overlapping solids.
 */
export function createFlangeNutMesh(
  input: FlangeNutModelPropsInput,
  options: FlangeNutMeshOptions = {},
): FlangeNutMesh {
  const props = flangeNutModelPropsSchema.parse(input)
  const d = getFlangeNutDimensions(props)
  const { radial, axial } = resolution(options)
  const steps = Math.ceil((d.height / d.threadPitch) * axial)
  const positions: number[] = [],
    indices: number[] = []
  const ring = (z: number, radius: (angle: number) => number) => {
    const start = positions.length / 3
    for (let i = 0; i < radial; i++) {
      const angle = (i * 2 * Math.PI) / radial,
        r = radius(angle)
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
  const flangeSlope = Math.tan((d.flangeTaperAngle * Math.PI) / 180)
  const chamferSlope = 1 / Math.tan((d.topChamferAngle * Math.PI) / 180)
  const outer = (z: number, angle: number) =>
    Math.min(
      Math.max(
        hexRadius(angle, d.acrossFlats),
        d.flangeDiameter / 2 - Math.max(0, z - d.flangeRimHeight) / flangeSlope,
      ),
      d.faceDiameter / 2 + (d.height - z) * chamferSlope,
    )
  // Every cone/hex intersection gets a ring. Straight radial sections then
  // preserve the exact flange taper, top chamfer and hex flats at all heights.
  const outerLevels = [0, d.flangeRimHeight, d.height]
  for (let index = 0; index < radial; index++) {
    const radius = hexRadius((index * 2 * Math.PI) / radial, d.acrossFlats)
    outerLevels.push(
      d.flangeRimHeight + (d.flangeDiameter / 2 - radius) * flangeSlope,
      d.height - (radius - d.faceDiameter / 2) / chamferSlope,
    )
  }
  const levels = outerLevels
    .sort((a, b) => a - b)
    .filter((z, i, sorted) => i === 0 || z - sorted[i - 1]! > 1e-10)
  const first = ring(0, (angle) => outer(0, angle))
  let previous = first
  for (const z of levels.slice(1)) {
    const current = ring(z, (angle) => outer(z, angle))
    connect(previous, current)
    previous = current
  }
  const boreLevels = new Set(
    props.showThreads
      ? Array.from({ length: steps + 1 }, (_, i) =>
          i === steps ? d.height : (d.height * i) / steps,
        )
      : [0, d.height],
  )
  boreLevels.add(d.boreChamferDepth)
  boreLevels.add(d.height - d.boreChamferDepth)
  const minor = d.boreMinorDiameter / 2,
    depth = (d.diameter - d.boreMinorDiameter) / 2
  for (const z of [...boreLevels].sort((a, b) => b - a)) {
    const current = ring(z, (angle) => {
      const groove = Math.min(
        depth,
        Math.max(
          0,
          (threadDistance(z, angle, d.threadPitch) - 1 / 8) *
            d.threadPitch *
            Math.sqrt(3),
        ),
      )
      return Math.max(
        minor + (props.showThreads ? groove : 0),
        d.mouthDiameter / 2 - Math.min(z, d.height - z),
      )
    })
    connect(previous, current)
    previous = current
  }
  connect(previous, first)
  return { positions, indices }
}
