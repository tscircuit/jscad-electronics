import {
  compressionSpringModelPropsSchema,
  getCompressionSpringCenterlinePoint,
  getCompressionSpringDimensions,
  type CompressionSpringModelPropsInput,
} from "@tscircuit/modelprinter"
import { clipMeshToZRange } from "../../mechanical/clip-mesh-to-z-range"

export interface CompressionSpringMesh {
  positions: number[]
  indices: number[]
}

export interface CompressionSpringMeshOptions {
  segmentsPerTurn?: number
  wireSegments?: number
}

/** Imported piecewise centerline, radial/axial wire sections, planar ground ends. */
export function createCompressionSpringMesh(
  input: CompressionSpringModelPropsInput,
  options: CompressionSpringMeshOptions = {},
): CompressionSpringMesh {
  const props = compressionSpringModelPropsSchema.parse(input)
  const dimensions = getCompressionSpringDimensions(props)
  const segmentsPerTurn = options.segmentsPerTurn ?? 64
  const wireSegments = options.wireSegments ?? 24
  for (const [name, value, minimum, maximum] of [
    ["segmentsPerTurn", segmentsPerTurn, 16, 256],
    ["wireSegments", wireSegments, 8, 64],
  ] as const)
    if (
      !Number.isInteger(value) ||
      value < minimum ||
      value > maximum ||
      value % 4 !== 0
    )
      throw new Error(
        `${name} must be a multiple of four in [${minimum},${maximum}]`,
      )
  const steps = props.totalTurns * segmentsPerTurn
  if (!Number.isSafeInteger(steps) || (steps + 1) * wireSegments > 250000)
    throw new Error("Spring exceeds mesh resolution limit (250000 vertices)")
  const scale = Math.max(props.outerDiameter, props.freeLength)
  if (
    dimensions.activePitch - props.wireDiameter <= scale * 1e-10 ||
    props.wireDiameter <= scale * 1e-10 ||
    dimensions.insideDiameter <= scale * 1e-10
  )
    throw new Error("Spring clearance exceeds mesh resolution limit")

  const positions: number[] = []
  const indices: number[] = []
  const wireRadius = props.wireDiameter / 2
  for (let step = 0; step <= steps; step++) {
    const center = getCompressionSpringCenterlinePoint(
      props,
      step / segmentsPerTurn,
    )
    const meanRadius = Math.hypot(center.x, center.y)
    for (let sample = 0; sample < wireSegments; sample++) {
      const angle = (sample * 2 * Math.PI) / wireSegments
      // Exact cardinal section samples keep both bearing cuts and diameters exact.
      const cosine =
        sample === wireSegments / 4 || sample === (3 * wireSegments) / 4
          ? 0
          : Math.cos(angle)
      const sine =
        sample === 0 || sample === wireSegments / 2 ? 0 : Math.sin(angle)
      const radialOffset = wireRadius * cosine
      positions.push(
        center.x + (radialOffset * center.x) / meanRadius,
        center.y + (radialOffset * center.y) / meanRadius,
        center.z + wireRadius * sine,
      )
    }
  }
  const triangle = (a: number, b: number, c: number) => {
    if (props.hand === "left") indices.push(a, c, b)
    else indices.push(a, b, c)
  }
  for (let step = 0; step < steps; step++)
    for (let sample = 0; sample < wireSegments; sample++) {
      const next = (sample + 1) % wireSegments
      const a = step * wireSegments
      const b = (step + 1) * wireSegments
      triangle(a + sample, b + sample, b + next)
      triangle(a + sample, b + next, a + next)
    }
  // Terminal sections are cut in their radial/axial planes, before grinding.
  for (let corner = 1; corner + 1 < wireSegments; corner++) {
    triangle(0, corner, corner + 1)
    const end = steps * wireSegments
    triangle(end, end + corner + 1, end + corner)
  }
  return clipMeshToZRange(
    { positions, indices },
    dimensions.lowerBearingZ,
    dimensions.upperBearingZ,
  )
}
