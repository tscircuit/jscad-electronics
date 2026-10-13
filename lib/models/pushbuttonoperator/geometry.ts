import jscad from "@jscad/modeling"
import {
  pushbuttonOperatorModelPropsSchema,
  type PushbuttonOperatorModelPropsInput,
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

/** Panel pushbutton operator with nominal mounting barrel, bezel, circular plunger and two rear terminal tabs. The panel is at Z=bodyLength, the actuator faces +Z, and terminals project below Z=0. No contact rating is implied. */
export function createPushbuttonOperatorGeom(
  input: PushbuttonOperatorModelPropsInput = {},
) {
  const p = pushbuttonOperatorModelPropsSchema.parse(input)
  const body = cyl(p.panelDiameter, p.bodyLength)
  const bezel = ring(
    p.bezelDiameter,
    p.buttonDiameter * 0.95,
    3,
    0,
    0,
    p.bodyLength + 1.5,
  )
  const button = cyl(
    p.buttonDiameter,
    p.buttonHeight,
    0,
    0,
    p.bodyLength + p.buttonHeight / 2,
  )
  const lugs = [
    box(3, 1, 7, -p.panelDiameter * 0.25, 0, -3.5),
    box(3, 1, 7, p.panelDiameter * 0.25, 0, -3.5),
  ]
  return union(body, bezel, button, ...lugs)
}
export function createPushbuttonOperatorMesh(
  input: PushbuttonOperatorModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createPushbuttonOperatorGeom(input))
}
