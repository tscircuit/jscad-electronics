import jscad from "@jscad/modeling"
import {
  inductiveProximitySensorModelPropsSchema,
  type InductiveProximitySensorModelPropsInput,
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

/** Cylindrical inductive proximity sensor with two hex mounting nuts, a distinct sensing face on +Z and short cable tail on -Z. Circumferential ribs suggest nominal barrel threading; they are not a functional helical thread. */
export function createInductiveProximitySensorGeom(
  input: InductiveProximitySensorModelPropsInput = {},
) {
  const p = inductiveProximitySensorModelPropsSchema.parse(input)
  const body = cyl(p.barrelDiameter, p.barrelLength)
  const hexes = [
    cylinder({
      radius: p.nutWidth / Math.sqrt(3),
      height: p.nutThickness,
      segments: 6,
      center: [0, 0, p.barrelLength * 0.25],
    }),
    cylinder({
      radius: p.nutWidth / Math.sqrt(3),
      height: p.nutThickness,
      segments: 6,
      center: [0, 0, p.barrelLength * 0.45],
    }),
  ]
  const rings: Geom[] = []
  for (let i = 0; i < 8; i++)
    rings.push(
      ring(
        p.barrelDiameter + 0.5,
        p.barrelDiameter * 0.95,
        0.6,
        0,
        0,
        p.barrelLength * 0.55 + i * p.barrelLength * 0.04,
      ),
    )
  const face = cyl(
    p.barrelDiameter * 0.9,
    p.faceThickness,
    0,
    0,
    p.barrelLength + p.faceThickness / 2,
  )
  const cable = cyl(p.cableDiameter, p.cableLength, 0, 0, -p.cableLength / 2)
  return union(body, ...hexes, ...rings, face, cable)
}
export function createInductiveProximitySensorMesh(
  input: InductiveProximitySensorModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createInductiveProximitySensorGeom(input))
}
