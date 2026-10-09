import {
  splitWasherModelPropsSchema,
  type SplitWasherModelPropsInput,
} from "@tscircuit/modelprinter"

export interface SplitWasherMesh {
  positions: number[]
  indices: number[]
}
export interface SplitWasherMeshOptions {
  angularSegments?: number
}

/** One capped radial/vertical rectangular sweep. The minimum Z datum is zero. */
export function createSplitWasherMesh(
  input: SplitWasherModelPropsInput,
  options: SplitWasherMeshOptions = {},
): SplitWasherMesh {
  const p = splitWasherModelPropsSchema.parse(input)
  const segments = options.angularSegments ?? 360
  if (!Number.isInteger(segments) || segments < 24 || segments > 1440)
    throw new Error(
      "Split washer angular segments must be an integer from 24 to 1440",
    )
  const sweep = ((360 - p.gapAngle) * Math.PI) / 180
  const ri = p.innerDiameter / 2,
    ro = p.outerDiameter / 2
  const scale = Math.max(p.outerDiameter, p.thickness + p.rise)
  if (Math.min(ro - ri, p.thickness, (ri * sweep) / segments) <= scale * 1e-12)
    throw new Error(
      "Split washer dimensions exceed mesh precision at this resolution",
    )
  const positions: number[] = [],
    indices: number[] = []
  // Profile points run around the rectangular section; four vertices per slice.
  for (let i = 0; i <= segments; i++) {
    const f = i / segments,
      theta = sweep * f
    const c = Math.cos(theta),
      s = Math.sin(theta) * (p.leftHanded ? -1 : 1)
    for (const [radius, z] of [
      [ri, 0],
      [ro, 0],
      [ro, p.thickness],
      [ri, p.thickness],
    ])
      positions.push(radius! * c, radius! * s, z! + p.rise * f)
  }
  const triangle = (a: number, b: number, c: number) => {
    indices.push(a, p.leftHanded ? c : b, p.leftHanded ? b : c)
  }
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < 4; j++) {
      const a = 4 * i + j,
        b = 4 * i + ((j + 1) % 4)
      const c = b + 4,
        d = a + 4
      if (j === 2) {
        // Congruent helical skins preserve section thickness on thin washers.
        triangle(a, d, b)
        triangle(d, c, b)
      } else {
        triangle(a, d, c)
        triangle(a, c, b)
      }
    }
  }
  triangle(0, 1, 2)
  triangle(0, 2, 3)
  const end = 4 * segments
  triangle(end, end + 2, end + 1)
  triangle(end, end + 3, end + 2)
  return { positions, indices }
}
