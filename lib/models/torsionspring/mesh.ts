import {
  torsionSpringModelPropsSchema,
  getTorsionSpringDimensions,
  getTorsionSpringFrame,
  type TorsionSpringModelPropsInput,
} from "@tscircuit/modelprinter"
export interface TorsionSpringMesh {
  positions: number[]
  indices: number[]
}
export interface TorsionSpringMeshOptions {
  segmentsPerTurn?: number
  wireSegments?: number
}
/** Circular normal sections along the shared helix and its tangent legs. */
export function createTorsionSpringMesh(
  input: TorsionSpringModelPropsInput,
  options: TorsionSpringMeshOptions = {},
): TorsionSpringMesh {
  const p = torsionSpringModelPropsSchema.parse(input),
    d = getTorsionSpringDimensions(p)
  const segmentsPerTurn = options.segmentsPerTurn ?? 64,
    wireSegments = options.wireSegments ?? 24
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
  const steps = Math.ceil(p.turns * segmentsPerTurn)
  if ((steps + 3) * wireSegments + 2 > 250000)
    throw new Error("Spring exceeds mesh resolution limit (250000 vertices)")
  const scale = Math.max(
    p.outerDiameter,
    d.axialAdvance,
    p.startLegLength,
    p.endLegLength,
  )
  if (
    Math.min(
      p.wireDiameter,
      p.startLegLength,
      p.endLegLength,
      d.insideDiameter,
      p.pitch - p.wireDiameter,
    ) <=
    scale * 1e-10
  )
    throw new Error("Spring clearance exceeds mesh resolution limits")
  const distances = [
    0,
    ...Array.from(
      { length: steps + 1 },
      (_, i) => p.startLegLength + (d.coilLength * i) / steps,
    ),
    d.centerlineLength,
  ]
  // Mirror the same triangulation for left-hand coils; changing the diagonal
  // of a nonplanar quad would otherwise change its enclosed volume.
  const frameProps = { ...p, leftHand: false }
  const positions: number[] = [],
    indices: number[] = []
  for (const distance of distances) {
    const f = getTorsionSpringFrame(frameProps, distance)
    for (let j = 0; j < wireSegments; j++) {
      const angle = (2 * Math.PI * j) / wireSegments
      const c =
        j === wireSegments / 4 || j === (3 * wireSegments) / 4
          ? 0
          : Math.cos(angle)
      const s = j === 0 || j === wireSegments / 2 ? 0 : Math.sin(angle)
      for (let axis = 0; axis < 3; axis++)
        positions.push(
          f.position[axis]! +
            (p.wireDiameter / 2) *
              (f.normal[axis]! * c + f.binormal[axis]! * s),
        )
    }
  }
  for (let i = 0; i < distances.length - 1; i++)
    for (let j = 0; j < wireSegments; j++) {
      const n = (j + 1) % wireSegments,
        a = i * wireSegments,
        b = (i + 1) * wireSegments
      indices.push(a + j, a + n, b + j, a + n, b + n, b + j)
    }
  const firstCenter = positions.length / 3
  positions.push(
    ...getTorsionSpringFrame(frameProps, 0).position,
    ...getTorsionSpringFrame(frameProps, d.centerlineLength).position,
  )
  const end = (distances.length - 1) * wireSegments
  for (let j = 0; j < wireSegments; j++) {
    const n = (j + 1) % wireSegments
    indices.push(firstCenter, n, j, firstCenter + 1, end + j, end + n)
  }
  if (p.leftHand) {
    for (let i = 1; i < positions.length; i += 3) positions[i] = -positions[i]!
    for (let i = 0; i < indices.length; i += 3)
      [indices[i + 1], indices[i + 2]] = [indices[i + 2]!, indices[i + 1]!]
  }
  return { positions, indices }
}
