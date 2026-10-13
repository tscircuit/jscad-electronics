import jscad from "@jscad/modeling"
import {
  solenoidValveModelPropsSchema,
  type SolenoidValveModelPropsInput,
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

/** Generic directional air solenoid valve: long valve body, three cross ports, two mounting holes, coil and electrical connector envelope. The internal spool and port switching paths are omitted; the model is not a pneumatic schematic. */
export function createSolenoidValveGeom(
  input: SolenoidValveModelPropsInput = {},
) {
  const p = solenoidValveModelPropsSchema.parse(input)
  const body = box(p.length, p.width, p.height)
  const coilX = p.length / 2 - p.coilWidth / 2
  const coil = box(
    p.coilWidth,
    p.coilWidth,
    p.coilHeight,
    coilX,
    0,
    p.height + p.coilHeight / 2,
  )
  const connector = box(
    p.coilWidth * 0.65,
    p.coilWidth * 0.65,
    6,
    coilX,
    0,
    p.height + p.coilHeight + 3,
  )
  const pilot = cx(p.width * 0.4, 6, -p.length / 2 - 2, 0, p.height / 2)
  const holes: Geom[] = []
  for (const x of [-p.length / 3, 0, p.length / 3])
    holes.push(cy(p.portDiameter, p.width + 2, x, 0, p.height / 2))
  for (const x of [-1, 1])
    holes.push(
      cyl(
        p.portDiameter * 0.5,
        p.height + 2,
        x * p.length * 0.43,
        0,
        p.height / 2,
      ),
    )
  return subtract(union(body, coil, connector, pilot), ...holes)
}
export function createSolenoidValveMesh(
  input: SolenoidValveModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createSolenoidValveGeom(input))
}
