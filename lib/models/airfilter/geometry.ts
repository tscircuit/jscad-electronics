import jscad from "@jscad/modeling"
import {
  airFilterModelPropsSchema,
  type AirFilterModelPropsInput,
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

/** Pneumatic filter with a bowl guard, bottom drain and through ports in the head. Bowl and guard are a solid visual envelope; the filter media and transparent bowl interior are omitted. The drain is bored; there are no supplier-specific threads. */
export function createAirFilterGeom(input: AirFilterModelPropsInput = {}) {
  const p = airFilterModelPropsSchema.parse(input)
  const z = p.drainLength + p.bowlLength
  const head = box(
    p.bodyWidth,
    p.bodyDepth,
    p.bodyHeight,
    0,
    0,
    z + p.bodyHeight / 2,
  )
  const bowl = union(
    cyl(p.bowlDiameter, p.bowlLength, 0, 0, p.drainLength + p.bowlLength / 2),
    cyl(
      p.bowlDiameter * 0.65,
      p.bowlLength * 0.15,
      0,
      0,
      p.drainLength + p.bowlLength * 0.08,
    ),
  )
  const ribs: Geom[] = []
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4
    ribs.push(
      cyl(
        p.bowlDiameter * 0.09,
        p.bowlLength * 0.8,
        Math.cos(a) * p.bowlDiameter * 0.45,
        Math.sin(a) * p.bowlDiameter * 0.45,
        p.drainLength + p.bowlLength / 2,
      ),
    )
  }
  return subtract(
    union(head, bowl, cyl(p.bowlDiameter * 0.25, p.drainLength), ...ribs),
    cx(p.portDiameter, p.bodyWidth + 2, 0, 0, z + p.bodyHeight / 2),
    cyl(p.portDiameter * 0.4, p.drainLength + 1),
  )
}
export function createAirFilterMesh(input: AirFilterModelPropsInput = {}) {
  return geom3ToIndexedMesh(createAirFilterGeom(input))
}
