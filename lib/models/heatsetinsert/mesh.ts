import {
  heatSetInsertModelPropsSchema,
  type HeatSetInsertModelPropsInput,
} from "@tscircuit/modelprinter"
/** Welded connected annular indexed surface, outward oriented, in millimeters. */
export interface HeatSetInsertMesh {
  positions: number[]
  indices: number[]
}
export interface HeatSetInsertMeshOptions {
  radialSegments?: number
  segmentsPerPitch?: number
}
export function createHeatSetInsertMesh(
  input: HeatSetInsertModelPropsInput,
  options: HeatSetInsertMeshOptions = {},
): HeatSetInsertMesh {
  const p = heatSetInsertModelPropsSchema.parse(input)
  const repeat = p.knurlTeeth * 8
  const segments = options.radialSegments ?? Math.ceil(96 / repeat) * repeat
  const axial = options.segmentsPerPitch ?? 24
  if (
    !Number.isInteger(segments) ||
    segments < 24 ||
    segments > 768 ||
    segments % (4 * p.knurlTeeth) !== 0 ||
    !Number.isInteger(axial) ||
    axial < 8 ||
    axial > 64
  )
    throw new Error(
      "Mesh resolution requires 24..768 radial segments divisible by four times knurl teeth and 8..64 segments per pitch",
    )
  const outerSteps = Math.max(1, Math.ceil((p.length / p.knurlPitch) * axial))
  const innerSteps = p.showThreads
    ? Math.max(1, Math.ceil((p.length / p.threadPitch) * axial))
    : 1
  if (
    (outerSteps + Math.ceil((2 * p.length) / p.knurlPitch) + innerSteps + 4) *
      segments >
    400000
  )
    throw new Error("Insert exceeds mesh resolution limit")
  const positions: number[] = [],
    indices: number[] = []
  const ring = (z: number, radius: (theta: number) => number) => {
    const start = positions.length / 3
    for (let i = 0; i < segments; i++) {
      const theta = (i * 2 * Math.PI) / segments,
        r = radius(theta)
      positions.push(r * Math.cos(theta), r * Math.sin(theta), z)
    }
    return start
  }
  const connect = (a: number, b: number) => {
    for (let i = 0; i < segments; i++) {
      const n = (i + 1) % segments
      indices.push(a + i, a + n, b + n, a + i, b + n, b + i)
    }
  }
  const triangular = (q: number) => {
    const phase = ((q % 1) + 1) % 1
    return 2 * Math.min(phase, 1 - phase)
  }
  const outer = (z: number, theta: number) => {
    const u = (p.knurlTeeth * theta) / (2 * Math.PI),
      v = z / p.knurlPitch
    return (
      p.outerDiameter / 2 -
      p.knurlDepth * Math.max(triangular(u + v), triangular(u - v))
    )
  }
  // Include exact half-pitch crest rows, preserving phase and cut end planes.
  const outerLevels = new Set(
    Array.from(
      { length: outerSteps + 1 },
      (_, i) => (p.length * i) / outerSteps,
    ),
  )
  for (let i = 1; (i * p.knurlPitch) / 2 < p.length; i++)
    outerLevels.add((i * p.knurlPitch) / 2)
  const first = ring(0, (theta) => outer(0, theta))
  let previous = first
  const orderedLevels = [...outerLevels]
    .sort((a, b) => a - b)
    .filter((z, i, levels) => i === 0 || z - levels[i - 1]! > p.length * 1e-12)
  for (const z of orderedLevels.slice(1)) {
    const current = ring(z, (theta) => outer(z, theta))
    connect(previous, current)
    previous = current
  }
  const minor = p.threadMinorDiameter / 2,
    depth = (p.diameter - p.threadMinorDiameter) / 2
  for (let i = innerSteps; i >= 0; i--) {
    const z = (p.length * i) / innerSteps
    const current = ring(z, (theta) => {
      const phase =
          (((z / p.threadPitch -
            ((p.leftHand ? -1 : 1) * theta) / (2 * Math.PI)) %
            1) +
            1) %
          1,
        d = Math.min(phase, 1 - phase)
      return (
        minor +
        (p.showThreads
          ? Math.min(
              depth,
              Math.max(0, (d - 1 / 8) * p.threadPitch * Math.sqrt(3)),
            )
          : 0)
      )
    })
    connect(previous, current)
    previous = current
  }
  connect(previous, first)
  return { positions, indices }
}
