import jscad from "@jscad/modeling"
import {
  pressureSwitchModelPropsSchema,
  type PressureSwitchModelPropsInput,
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

/** Mechanical pressure switch enclosure with a bottom pressure port, top adjustment screw and bored cable gland on +X. The switch mechanism and pressure calibration are omitted. */
export function createPressureSwitchGeom(
  input: PressureSwitchModelPropsInput = {},
) {
  const p = pressureSwitchModelPropsSchema.parse(input)
  const body = box(
    p.width,
    p.depth,
    p.height,
    0,
    0,
    p.portLength + p.height / 2,
  )
  const port = cyl(p.portDiameter + 4, p.portLength)
  const adjust = cyl(p.width * 0.35, 6, 0, 0, p.portLength + p.height + 3)
  const gland = cx(
    p.portDiameter + 3,
    10,
    p.width / 2 + 4,
    0,
    p.portLength + p.height * 0.6,
  )
  return subtract(
    union(body, port, adjust, gland),
    cyl(p.portDiameter, p.portLength + 2),
    cx(
      p.portDiameter * 0.5,
      11,
      p.width / 2 + 4,
      0,
      p.portLength + p.height * 0.6,
    ),
    box(p.width * 0.2, 1, 2, 0, 0, p.portLength + p.height + 6),
  )
}
export function createPressureSwitchMesh(
  input: PressureSwitchModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createPressureSwitchGeom(input))
}
