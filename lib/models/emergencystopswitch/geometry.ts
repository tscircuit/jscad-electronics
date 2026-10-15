import jscad from "@jscad/modeling"
import {
  emergencyStopSwitchModelPropsSchema,
  type EmergencyStopSwitchModelPropsInput,
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

/** Mushroom-head emergency stop operator with a panel collar, tapered head, rear contact block and terminal tabs. This is a mechanical placement model and does not assert contact configuration, latching performance or safety certification. */
export function createEmergencyStopSwitchGeom(
  input: EmergencyStopSwitchModelPropsInput = {},
) {
  const p = emergencyStopSwitchModelPropsSchema.parse(input)
  const contact = box(
    p.panelDiameter,
    p.panelDiameter * 0.8,
    p.bodyLength * 0.6,
  )
  const barrel = cyl(
    p.panelDiameter,
    p.bodyLength * 0.4,
    0,
    0,
    p.bodyLength * 0.8,
  )
  const collar = cyl(p.collarDiameter, 4, 0, 0, p.bodyLength + 2)
  const mushroom = jscad.primitives.cylinderElliptic({
    startRadius: [p.collarDiameter * 0.4, p.collarDiameter * 0.4],
    endRadius: [p.headDiameter / 2, p.headDiameter / 2],
    height: p.headHeight * 0.5,
    segments: 48,
    center: [0, 0, p.bodyLength + 4 + p.headHeight * 0.25],
  })
  const cap = cyl(
    p.headDiameter,
    p.headHeight * 0.5,
    0,
    0,
    p.bodyLength + 4 + p.headHeight * 0.75,
  )
  const lugs = [
    box(3, 1, 6, -p.panelDiameter * 0.3, 0, -3),
    box(3, 1, 6, p.panelDiameter * 0.3, 0, -3),
  ]
  return union(contact, barrel, collar, mushroom, cap, ...lugs)
}
export function createEmergencyStopSwitchMesh(
  input: EmergencyStopSwitchModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createEmergencyStopSwitchGeom(input))
}
