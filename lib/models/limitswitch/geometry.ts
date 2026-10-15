import jscad from "@jscad/modeling"
import {
  limitSwitchModelPropsSchema,
  type LimitSwitchModelPropsInput,
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

/** Industrial roller-lever limit switch with a transverse pivot, straight lever, end roller and two mounting bores. The lever is fixed in its nominal horizontal position; electrical contacts and motion are omitted. */
export function createLimitSwitchGeom(input: LimitSwitchModelPropsInput = {}) {
  const p = limitSwitchModelPropsSchema.parse(input)
  const body = box(p.width, p.depth, p.height)
  const head = box(p.width * 0.65, p.depth * 0.8, 8, 0, 0, p.height + 4)
  const pivot = cy(p.rollerDiameter * 0.7, p.depth + 2, 0, 0, p.height + 6)
  const lever = box(
    p.actuatorLength,
    p.leverThickness,
    p.leverThickness,
    p.actuatorLength / 2,
    0,
    p.height + 8,
  )
  const roller = cy(
    p.rollerDiameter,
    p.leverThickness * 2,
    p.actuatorLength,
    0,
    p.height + 8,
  )
  return subtract(
    union(body, head, pivot, lever, roller),
    cy(p.holeDiameter, p.depth + 2, -p.width * 0.28, 0, p.height * 0.2),
    cy(p.holeDiameter, p.depth + 2, p.width * 0.28, 0, p.height * 0.2),
  )
}
export function createLimitSwitchMesh(input: LimitSwitchModelPropsInput = {}) {
  return geom3ToIndexedMesh(createLimitSwitchGeom(input))
}
