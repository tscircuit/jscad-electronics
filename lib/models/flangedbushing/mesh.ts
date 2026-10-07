import {
  flangedBushingModelPropsSchema,
  getFlangedBushingDimensions,
  type FlangedBushingModelPropsInput,
} from "@tscircuit/modelprinter"

/** Shared ring vertices and outward counterclockwise triangles, in millimeters. */
export interface FlangedBushingMesh {
  positions: number[]
  indices: number[]
}

/** Integral flange at Z=0..flangeThickness; total length includes the flange. */
export function createFlangedBushingMesh(
  input: FlangedBushingModelPropsInput,
): FlangedBushingMesh {
  const props = flangedBushingModelPropsSchema.parse(input)
  const d = getFlangedBushingDimensions(props)
  const ri = d.innerDiameter / 2
  const ro = d.outerDiameter / 2
  const rf = d.flangeDiameter / 2
  // One continuous boundary, not two overlapping sleeves: the shoulder belongs
  // to the exterior and the bore remains uninterrupted through the flange.
  const profile: [number, number][] = [
    [rf, 0],
    [rf, d.shoulderZ],
    [ro, d.shoulderZ],
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
