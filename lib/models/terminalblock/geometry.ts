import jscad from "@jscad/modeling"
import {
  terminalBlockModelPropsSchema,
  type TerminalBlockModelPropsInput,
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

/** Single DIN terminal block with two wire-entry bores, paired slotted screw heads, center separator recess and underside rail clip recess. The insulating body is an envelope; screw thread, conductive cage and rail latching mechanics are omitted. */
export function createTerminalBlockGeom(
  input: TerminalBlockModelPropsInput = {},
) {
  const p = terminalBlockModelPropsSchema.parse(input)
  const body = box(p.width, p.depth, p.height, 0, 0, p.height / 2 + 3)
  const foot = box(p.width, p.depth * 0.7, 3)
  const screws: Geom[] = []
  for (const y of [-p.depth * 0.25, p.depth * 0.25])
    screws.push(
      subtract(
        cyl(p.screwDiameter, 2, 0, y, p.height + 4),
        box(p.screwDiameter * 0.9, 0.6, 1, 0, y, p.height + 4.8),
      ),
    )
  const wirePorts = [
    cy(p.wireDiameter, p.depth / 3, 0, -p.depth * 0.4, p.height * 0.55),
    cy(p.wireDiameter, p.depth / 3, 0, p.depth * 0.4, p.height * 0.55),
  ]
  const channel = box(
    p.width * 0.4,
    p.depth * 0.2,
    p.height * 0.3,
    0,
    0,
    p.height + 3,
  )
  return subtract(
    union(body, foot, ...screws),
    ...wirePorts,
    channel,
    box(p.width + 2, p.depth * 0.3, 1.5, 0, 0, 0.75),
  )
}
export function createTerminalBlockMesh(
  input: TerminalBlockModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createTerminalBlockGeom(input))
}
