import {
  beltIdlerModelPropsSchema,
  getBeltIdlerDimensions,
  type BeltIdlerModelPropsInput,
} from "@tscircuit/modelprinter"
export type BeltIdlerMesh = { positions: number[]; indices: number[] }
export type BeltIdlerMeshOptions = { radialSegments?: number }
export function createBeltIdlerMesh(
  input: BeltIdlerModelPropsInput = {},
  options: BeltIdlerMeshOptions = {},
): BeltIdlerMesh {
  const p = beltIdlerModelPropsSchema.parse(input),
    d = getBeltIdlerDimensions(p)
  const segments = options.radialSegments ?? 128
  if (
    !Number.isInteger(segments) ||
    segments < 32 ||
    segments > 512 ||
    segments % 4 !== 0
  )
    throw new Error(
      "Idler radialSegments must be a multiple of four from 32 through 512",
    )
  const scale = Math.max(d.flangeDiameter, d.totalWidth)
  if (
    Math.min(
      p.boreDiameter,
      d.radialWallThickness,
      p.flangeThickness,
      p.sideClearance,
      p.beltWidth,
    ) <= Math.max(scale * 1e-9, 1e-7)
  )
    throw new Error(
      "Idler features are below the supported numerical resolution",
    )
  const profile: [number, number][] = [
    [p.boreDiameter / 2, d.minZ],
    [d.flangeDiameter / 2, d.minZ],
    [d.flangeDiameter / 2, 0],
    [d.contactRadius, 0],
    [d.contactRadius, d.faceWidth],
    [d.flangeDiameter / 2, d.faceWidth],
    [d.flangeDiameter / 2, d.maxZ],
    [p.boreDiameter / 2, d.maxZ],
  ]
  const mesh: BeltIdlerMesh = { positions: [], indices: [] }
  for (const [r, z] of profile)
    for (let i = 0; i < segments; i++) {
      const a = (2 * Math.PI * i) / segments
      mesh.positions.push(r * Math.cos(a), r * Math.sin(a), z)
    }
  for (let ring = 0; ring < profile.length; ring++)
    for (let i = 0; i < segments; i++) {
      const j = (i + 1) % segments,
        next = (ring + 1) % profile.length
      const a = ring * segments + i,
        b = ring * segments + j,
        c = next * segments + j,
        e = next * segments + i
      mesh.indices.push(a, b, c, a, c, e)
    }
  return mesh
}
