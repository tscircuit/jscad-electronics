import {
  getDowelPinDimensions,
  type DowelPinModelPropsInput,
} from "@tscircuit/modelprinter"
/** Closed, outward-wound indexed triangles in millimeters. */
export interface DowelPinMesh {
  positions: number[]
  indices: number[]
}
export interface DowelPinMeshOptions {
  radialSegments?: number
}
/** Nominal cylinder with two fixed 15-degree conical leads and flat end disks. */
export function createDowelPinMesh(
  input: DowelPinModelPropsInput,
  options: DowelPinMeshOptions = {},
): DowelPinMesh {
  const d = getDowelPinDimensions(input)
  const radial = options.radialSegments ?? 96
  if (
    !Number.isInteger(radial) ||
    radial < 24 ||
    radial > 256 ||
    radial % 4 !== 0
  )
    throw new Error(
      "Mesh resolution limit: radial segments must be a multiple of 4 in [24,256]",
    )
  const positions: number[] = [],
    indices: number[] = []
  const levels: [
    [number, number],
    [number, number],
    [number, number],
    [number, number],
  ] = [
    [0, d.endDiameter / 2],
    [d.endLeadLength, d.diameter / 2],
    [d.length - d.endLeadLength, d.diameter / 2],
    [d.length, d.endDiameter / 2],
  ]
  for (const [z, radius] of levels)
    for (let i = 0; i < radial; i++) {
      const angle = (i * 2 * Math.PI) / radial
      positions.push(radius * Math.cos(angle), radius * Math.sin(angle), z)
    }
  for (let layer = 0; layer < 3; layer++)
    for (let i = 0; i < radial; i++) {
      const n = (i + 1) % radial,
        a = layer * radial,
        b = (layer + 1) * radial
      indices.push(a + i, a + n, b + n, a + i, b + n, b + i)
    }
  for (const [ring, z, up] of [
    [0, 0, false],
    [3 * radial, d.length, true],
  ] as const) {
    const center = positions.length / 3
    positions.push(0, 0, z)
    for (let i = 0; i < radial; i++) {
      const n = (i + 1) % radial
      indices.push(center, ring + (up ? i : n), ring + (up ? n : i))
    }
  }
  return { positions, indices }
}
