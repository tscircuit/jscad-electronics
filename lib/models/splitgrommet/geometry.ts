import {
  splitGrommetModelPropsSchema,
  getSplitGrommetDimensions,
  type SplitGrommetModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  extrudePlanarProfile,
  circularProfile,
  type ProfilePoint,
} from "../../mechanical/extrude-planar-profile"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import earcut from "earcut"

export interface SplitGrommetMesh {
  positions: number[]
  indices: number[]
}
/** Split cable protection ring centered on XY and the panel midplane Z=0. A square-shouldered groove occupies Z=-grooveWidth/2 through +grooveWidth/2 and fits the stated panel hole. A constant-width slit opens toward +X from the bore through both flanges. Height spans -height/2 to +height/2; all dimensions are nominal custom geometry. */
export function createSplitGrommetMesh(
  input: SplitGrommetModelPropsInput,
): SplitGrommetMesh {
  const p = splitGrommetModelPropsSchema.parse(input),
    d = getSplitGrommetDimensions(p)
  if (
    Math.min(
      d.flangeThickness,
      d.minimumWallThickness,
      p.grooveDepth,
      p.grooveWidth,
      p.splitWidth,
    ) <=
    Math.max(...d.size) * 1e-10
  )
    throw new Error("splitgrommet dimensions exceed mesh resolution limits")
  const section: ProfilePoint[] = [
    [p.innerDiameter / 2, d.bottomZ],
    [p.outerDiameter / 2, d.bottomZ],
    [p.outerDiameter / 2, d.grooveStartZ],
    [d.grooveRootDiameter / 2, d.grooveStartZ],
    [d.grooveRootDiameter / 2, d.grooveEndZ],
    [p.outerDiameter / 2, d.grooveEndZ],
    [p.outerDiameter / 2, d.topZ],
    [p.innerDiameter / 2, d.topZ],
  ]
  const segments = 128,
    count = section.length
  const positions: number[] = [],
    indices: number[] = []
  // Each radius has its own terminal angle so the slit sides are planes at
  // Y=+-splitWidth/2 rather than radial wedge faces. Cardinal columns preserve
  // the nominal -X and +/-Y envelope and all shared profile seams.
  for (let i = 0; i <= segments; i++)
    for (const [radius, z] of section) {
      const alpha = Math.asin(p.splitWidth / (2 * radius))
      const stops = [
        alpha,
        Math.PI / 2,
        Math.PI,
        (3 * Math.PI) / 2,
        2 * Math.PI - alpha,
      ]
      const arc = Math.min(3, Math.floor(i / 32)),
        fraction = (i - arc * 32) / 32
      const angle = stops[arc]! + (stops[arc + 1]! - stops[arc]!) * fraction
      positions.push(
        i === 0 || i === segments
          ? Math.sqrt(radius ** 2 - (p.splitWidth / 2) ** 2)
          : radius * Math.cos(angle),
        i === 0
          ? d.slitMaxY
          : i === segments
            ? d.slitMinY
            : radius * Math.sin(angle),
        z,
      )
    }
  for (let i = 0; i < segments; i++)
    for (let j = 0; j < count; j++) {
      const next = (j + 1) % count
      const a = i * count + j,
        b = (i + 1) * count + j,
        c = (i + 1) * count + next,
        e = i * count + next
      indices.push(a, b, c, a, c, e)
    }
  const slitSection = section.flatMap(([radius, z]) => [
    Math.sqrt(radius ** 2 - (p.splitWidth / 2) ** 2),
    z,
  ])
  const caps = earcut(slitSection)
  for (let i = 0; i < caps.length; i += 3) {
    const a = caps[i]!,
      b = caps[i + 1]!,
      c = caps[i + 2]!
    indices.push(
      a,
      b,
      c,
      segments * count + a,
      segments * count + c,
      segments * count + b,
    )
  }
  return { positions, indices }
}
export function createSplitGrommetGeom(input: SplitGrommetModelPropsInput) {
  return indexedMeshToGeom3(createSplitGrommetMesh(input))
}
