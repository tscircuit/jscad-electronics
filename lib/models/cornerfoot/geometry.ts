import {
  cornerFootModelPropsSchema,
  getCornerFootDimensions,
  type CornerFootModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  circularProfile,
  extrudePlanarProfile,
  joinProfileMeshes,
  type ProfileMesh,
  type ProfilePoint,
} from "../../mechanical/extrude-planar-profile"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
export interface CornerFootMesh {
  positions: number[]
  indices: number[]
}

/** The base, locating walls, and fixing-hole surface share indexed seam
 * vertices. Only exposed faces are emitted; there are no internal union caps.
 */
export function createCornerFootMesh(
  input: CornerFootModelPropsInput,
): CornerFootMesh {
  const p = cornerFootModelPropsSchema.parse(input),
    d = getCornerFootDimensions(p)
  const scale = Math.max(...d.size)
  if (
    Math.min(
      p.baseThickness,
      p.height - p.baseThickness,
      p.wallThickness,
      p.holeDiameter,
      Math.min(p.width / 2, p.depth / 2) - p.wallThickness - p.holeDiameter / 2,
    ) <=
    scale * 1e-10
  )
    throw new Error("cornerfoot dimensions exceed mesh resolution limits")
  const x0 = -p.width / 2,
    x1 = p.width / 2,
    y0 = -p.depth / 2,
    y1 = p.depth / 2,
    xi = d.seatMinX,
    yi = d.seatMinY,
    b = p.baseThickness,
    h = p.height
  const bore = circularProfile(0, 0, p.holeDiameter / 2, 128)
  const planar = (
    outer: ProfilePoint[],
    holes: ProfilePoint[][],
    project: (u: number, v: number) => [number, number, number],
    reverse = false,
  ): ProfileMesh => {
    const mesh = extrudePlanarProfile({
      outer,
      holes,
      start: 0,
      end: 1,
      project: (u, v) => project(u, v),
      reverse,
    })
    const count = mesh.positions.length / 6,
      indices: number[] = []
    // Keep the positive-depth cap only; the projected side walls have zero
    // depth and are deliberately excluded from this individual surface patch.
    for (let i = 0; i < mesh.indices.length; i += 3) {
      const triangle = mesh.indices.slice(i, i + 3)
      if (triangle.every((index) => index >= count))
        indices.push(...triangle.map((index) => index - count))
    }
    return { positions: mesh.positions.slice(count * 3), indices }
  }
  const rectangle = (
    a: number,
    b: number,
    c: number,
    d: number,
  ): ProfilePoint[] => [
    [a, b],
    [c, b],
    [c, d],
    [a, d],
  ]
  const wall: ProfileMesh = { positions: [], indices: [] }
  for (const z of [0, b])
    for (const [x, y] of bore) wall.positions.push(x, y, z)
  for (let i = 0; i < bore.length; i++) {
    const next = (i + 1) % bore.length
    wall.indices.push(
      i,
      i + bore.length,
      next + bore.length,
      i,
      next + bore.length,
      next,
    )
  }
  return joinProfileMeshes([
    planar(rectangle(x0, y0, x1, y1), [bore], (x, y) => [x, y, 0], true),
    planar(rectangle(xi, yi, x1, y1), [bore], (x, y) => [x, y, b]),
    planar(
      [
        [x0, y0],
        [x1, y0],
        [x1, yi],
        [xi, yi],
        [xi, y1],
        [x0, y1],
      ],
      [],
      (x, y) => [x, y, h],
    ),
    planar(rectangle(y0, 0, y1, h), [], (y, z) => [x0, y, z], true),
    planar(rectangle(x0, 0, x1, h), [], (x, z) => [x, y0, z]),
    planar(
      [
        [y0, 0],
        [y1, 0],
        [y1, b],
        [yi, b],
        [yi, h],
        [y0, h],
      ],
      [],
      (y, z) => [x1, y, z],
    ),
    planar(
      [
        [x0, 0],
        [x1, 0],
        [x1, b],
        [xi, b],
        [xi, h],
        [x0, h],
      ],
      [],
      (x, z) => [x, y1, z],
      true,
    ),
    planar(rectangle(yi, b, y1, h), [], (y, z) => [xi, y, z]),
    planar(rectangle(xi, b, x1, h), [], (x, z) => [x, yi, z], true),
    wall,
  ])
}
export function createCornerFootGeom(input: CornerFootModelPropsInput) {
  return indexedMeshToGeom3(createCornerFootMesh(input))
}
