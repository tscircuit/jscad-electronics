import {
  getPlainBushingDimensions,
  plainBushingModelPropsSchema,
  type PlainBushingModelPropsInput,
} from "@tscircuit/modelprinter"

/** Shared ring vertices and outward counterclockwise triangles, in millimeters. */
export interface PlainBushingMesh {
  positions: number[]
  indices: number[]
}

/** Annular end faces at Z=0/length; chamfers cut all four bore/outside rims. */
export function createPlainBushingMesh(
  input: PlainBushingModelPropsInput,
): PlainBushingMesh {
  const props = plainBushingModelPropsSchema.parse(input)
  const d = getPlainBushingDimensions(props)
  const ri = d.innerDiameter / 2
  const ro = d.outerDiameter / 2
  const c = props.edgeChamfer
  // Traverse the closed radial/axial section: outside upward, inside downward.
  // No center cap is ever added, so both end openings remain connected.
  const profile: [number, number][] =
    c > 0
      ? [
          [d.endOuterDiameter / 2, 0],
          [ro, c],
          [ro, d.length - c],
          [d.endOuterDiameter / 2, d.length],
          [d.endInnerDiameter / 2, d.length],
          [ri, d.length - c],
          [ri, c],
          [d.endInnerDiameter / 2, 0],
        ]
      : [
          [ro, 0],
          [ro, d.length],
          [ri, d.length],
          [ri, 0],
        ]
  const segments = 96 // Four cardinal directions are exact; allocation is fixed.
  const positions: number[] = []
  const indices: number[] = []
  for (const [radius, z] of profile)
    for (let i = 0; i < segments; i++) {
      const angle = (i * Math.PI * 2) / segments
      positions.push(radius * Math.cos(angle), radius * Math.sin(angle), z)
    }
  for (let ring = 0; ring < profile.length; ring++) {
    const a = ring * segments
    const b = ((ring + 1) % profile.length) * segments
    for (let i = 0; i < segments; i++) {
      const next = (i + 1) % segments
      indices.push(a + i, a + next, b + next, a + i, b + next, b + i)
    }
  }
  return { positions, indices }
}
