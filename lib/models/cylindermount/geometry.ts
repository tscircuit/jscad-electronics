import jscad from "@jscad/modeling"
import {
  cylinderMountModelPropsSchema,
  type CylinderMountModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
type Geom = jscad.geometries.geom3.Geom3
const { cuboid, cylinder } = jscad.primitives
const { union, subtract } = jscad.booleans
const { translate, rotateX, rotateY } = jscad.transforms
const box = (w: number, d: number, h: number, x = 0, y = 0, z = h / 2) =>
  cuboid({ size: [w, d, h], center: [x, y, z] })
const cyl = (d: number, h: number, x = 0, y = 0, z = h / 2) =>
  cylinder({ radius: d / 2, height: h, center: [x, y, z], segments: 48 })
const cx = (d: number, l: number, x = 0, y = 0, z = 0) =>
  translate(
    [x, y, z],
    rotateY(Math.PI / 2, cylinder({ radius: d / 2, height: l, segments: 48 })),
  )
const cy = (d: number, l: number, x = 0, y = 0, z = 0) =>
  translate(
    [x, y, z],
    rotateX(Math.PI / 2, cylinder({ radius: d / 2, height: l, segments: 48 })),
  )
const ring = (od: number, id: number, h: number, x = 0, y = 0, z = h / 2) =>
  subtract(cyl(od, h, x, y, z), cyl(id, h + 2, x, y, z))

/** L-shaped rod-end or cylinder mounting bracket with one horizontal clearance bore in the upright and two mounting holes in the foot. Width is X, depth is Y, height is Z; all bores are nominal clearance openings. */
export function createCylinderMountGeom(
  input: CylinderMountModelPropsInput = {},
) {
  const p = cylinderMountModelPropsSchema.parse(input)
  const foot = box(p.width, p.depth, p.thickness)
  const wall = box(
    p.width,
    p.thickness,
    p.height,
    0,
    p.depth / 2 - p.thickness / 2,
    p.height / 2,
  )
  const holes = [
    cy(
      p.boreDiameter,
      p.depth + 2,
      0,
      p.depth / 2 - p.thickness / 2,
      p.height * 0.6,
    ),
  ]
  for (const x of [-1, 1])
    holes.push(
      cyl(
        p.holeDiameter,
        p.thickness + 2,
        x * (p.width / 2 - p.thickness),
        -p.depth / 4,
        p.thickness / 2,
      ),
    )
  return subtract(union(foot, wall), ...holes)
}
export function createCylinderMountMesh(
  input: CylinderMountModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createCylinderMountGeom(input))
}
