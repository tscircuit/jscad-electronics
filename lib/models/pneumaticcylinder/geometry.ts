import jscad from "@jscad/modeling"
import {
  pneumaticCylinderModelPropsSchema,
  type PneumaticCylinderModelPropsInput,
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

/** Air cylinder with square end caps. The body is along +Z; extension is the visible rod displacement and cannot exceed stroke. End-cap screw holes and cross-body pneumatic ports are geometric openings. Bore and stroke describe nominal assembly sizing; piston, seals, threads and concealed internals are omitted. */
export function createPneumaticCylinderGeom(
  input: PneumaticCylinderModelPropsInput = {},
) {
  const p = pneumaticCylinderModelPropsSchema.parse(input)
  const cap = p.boreDiameter + 12
  const outer = p.boreDiameter + 8
  const body = cyl(
    outer,
    p.bodyLength - 2 * p.endCapLength,
    0,
    0,
    p.bodyLength / 2,
  )
  const caps = [
    box(cap, cap, p.endCapLength, 0, 0, p.endCapLength / 2),
    box(cap, cap, p.endCapLength, 0, 0, p.bodyLength - p.endCapLength / 2),
  ]
  let solid = union(
    body,
    ...caps,
    cyl(
      p.rodDiameter,
      p.extension + 2,
      0,
      0,
      p.bodyLength + p.extension / 2 - 1,
    ),
    ring(p.rodDiameter + 6, p.rodDiameter, 3, 0, 0, p.bodyLength - 1.5),
  )
  const holes: Geom[] = []
  for (const z of [p.endCapLength / 2, p.bodyLength - p.endCapLength / 2]) {
    holes.push(cx(p.portDiameter, cap + 2, 0, 0, z))
    for (const x of [-1, 1])
      for (const y of [-1, 1])
        holes.push(
          cyl(3, p.endCapLength + 2, x * cap * 0.38, y * cap * 0.38, z),
        )
  }
  return subtract(solid, ...holes)
}
export function createPneumaticCylinderMesh(
  input: PneumaticCylinderModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createPneumaticCylinderGeom(input))
}
