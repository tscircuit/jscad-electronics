import jscad from "@jscad/modeling"
import {
  photoelectricSensorModelPropsSchema,
  type PhotoelectricSensorModelPropsInput,
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

/** Rectangular photoelectric sensor with two projecting optical lenses facing -Y, a top status indicator, cable tail and two transverse mounting holes. Optical axes are nominal and no sensing range is implied. */
export function createPhotoelectricSensorGeom(
  input: PhotoelectricSensorModelPropsInput = {},
) {
  const p = photoelectricSensorModelPropsSchema.parse(input)
  const body = box(p.width, p.depth, p.height)
  const lenses: Geom[] = []
  for (const z of [p.height * 0.5, p.height * 0.8])
    lenses.push(cy(p.lensDiameter, 3, 0, -p.depth / 2 - 1, z))
  const cable = cyl(p.cableDiameter, 10, 0, 0, -5)
  const led = cyl(p.cableDiameter * 0.6, 1, 0, 0, p.height + 0.5)
  const holes = [
    cx(p.mountHoleDiameter, p.width + 2, 0, p.depth * 0.2, p.height * 0.15),
    cx(p.mountHoleDiameter, p.width + 2, 0, -p.depth * 0.2, p.height * 0.15),
  ]
  return subtract(union(body, ...lenses, cable, led), ...holes)
}
export function createPhotoelectricSensorMesh(
  input: PhotoelectricSensorModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createPhotoelectricSensorGeom(input))
}
