import jscad from "@jscad/modeling"
import {
  airLubricatorModelPropsSchema,
  type AirLubricatorModelPropsInput,
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

/** Air-line lubricator with cylindrical reservoir, sight recess, retaining collar and top fill cap. The solid reservoir is an external envelope and does not represent oil volume or the metering internals. */
export function createAirLubricatorGeom(
  input: AirLubricatorModelPropsInput = {},
) {
  const p = airLubricatorModelPropsSchema.parse(input)
  const head = box(
    p.bodyWidth,
    p.bodyDepth,
    p.bodyHeight,
    0,
    0,
    p.bowlLength + p.bodyHeight / 2,
  )
  const bowl = cyl(p.bowlDiameter, p.bowlLength)
  const collar = ring(
    p.bowlDiameter + 4,
    p.bowlDiameter * 0.8,
    5,
    0,
    0,
    p.bowlLength - 2.5,
  )
  const fill = cyl(
    p.fillDiameter,
    p.fillHeight,
    0,
    0,
    p.bowlLength + p.bodyHeight + p.fillHeight / 2,
  )
  const sight = box(
    p.bowlDiameter * 0.15,
    p.bowlDiameter * 0.12,
    p.bowlLength * 0.65,
    0,
    -p.bowlDiameter / 2,
    p.bowlLength / 2,
  )
  return subtract(
    union(head, bowl, collar, fill, sight),
    cx(p.portDiameter, p.bodyWidth + 2, 0, 0, p.bowlLength + p.bodyHeight / 2),
    box(
      p.bowlDiameter * 0.07,
      p.bowlDiameter * 0.2,
      p.bowlLength * 0.5,
      0,
      -p.bowlDiameter / 2 - 0.2,
      p.bowlLength / 2,
    ),
  )
}
export function createAirLubricatorMesh(
  input: AirLubricatorModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createAirLubricatorGeom(input))
}
