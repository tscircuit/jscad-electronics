import earcut from "earcut"
import {
  timingBeltModelPropsSchema,
  getTimingBeltDimensions,
  type TimingBeltModelPropsInput,
} from "@tscircuit/modelprinter"
export type TimingBeltMesh = { positions: number[]; indices: number[] }
export function createTimingBeltMesh(
  input: TimingBeltModelPropsInput = {},
): TimingBeltMesh {
  const p = timingBeltModelPropsSchema.parse(input),
    d = getTimingBeltDimensions(p)
  if (p.width <= Math.max(d.length * 1e-9, 1e-7) || p.width > 1e8)
    throw new Error("Belt width is outside the supported numerical resolution")
  const section: [number, number][] = [[0, d.toothRootZ]]
  for (let tooth = 0; tooth < p.toothCount; tooth++) {
    const x = (tooth + 0.5) * d.pitch
    section.push(
      [x - d.toothBaseWidth / 2, d.toothRootZ],
      [x - d.toothTipWidth / 2, d.toothTipZ],
      [x + d.toothTipWidth / 2, d.toothTipZ],
      [x + d.toothBaseWidth / 2, d.toothRootZ],
    )
  }
  section.push([d.length, d.toothRootZ], [d.length, d.backZ], [0, d.backZ])
  const mesh: TimingBeltMesh = { positions: [], indices: [] },
    count = section.length
  for (const y of [-p.width / 2, p.width / 2])
    for (const [x, z] of section) mesh.positions.push(x, y, z)
  const caps = earcut(section.flat())
  for (let i = 0; i < caps.length; i += 3) {
    const a = caps[i]!,
      b = caps[i + 1]!,
      c = caps[i + 2]!
    mesh.indices.push(a, b, c, count + a, count + c, count + b)
  }
  for (let i = 0; i < count; i++) {
    const j = (i + 1) % count
    mesh.indices.push(i, count + i, count + j, i, count + j, j)
  }
  return mesh
}
