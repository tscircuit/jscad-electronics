import jscad from "@jscad/modeling"
import {
  vacuumCupModelPropsSchema,
  type VacuumCupModelPropsInput,
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

/** Tapered vacuum suction cup with a hollow bell, sealing lip and through-bored connection neck. Cup lip rests on Z=0; no flexible deformation, thread form or vacuum rating is modeled. */
export function createVacuumCupGeom(input: VacuumCupModelPropsInput = {}) {
  const p = vacuumCupModelPropsSchema.parse(input)
  const bell = jscad.primitives.cylinderElliptic({
    startRadius: [p.diameter / 2, p.diameter / 2],
    endRadius: [p.neckDiameter / 2, p.neckDiameter / 2],
    height: p.height,
    center: [0, 0, p.height / 2],
    segments: 48,
  })
  const cavity = jscad.primitives.cylinderElliptic({
    startRadius: [
      p.diameter / 2 - p.wallThickness,
      p.diameter / 2 - p.wallThickness,
    ],
    endRadius: [p.boreDiameter / 2, p.boreDiameter / 2],
    height: p.height - p.wallThickness,
    center: [0, 0, (p.height - p.wallThickness) / 2 - 0.1],
    segments: 48,
  })
  const neck = cyl(
    p.neckDiameter,
    p.neckLength,
    0,
    0,
    p.height + p.neckLength / 2,
  )
  const lip = ring(
    p.diameter + 2 * p.wallThickness,
    p.diameter - 2 * p.wallThickness,
    p.wallThickness,
  )
  return subtract(
    union(bell, neck, lip),
    cavity,
    cyl(
      p.boreDiameter,
      p.height + p.neckLength + 2,
      0,
      0,
      (p.height + p.neckLength) / 2,
    ),
  )
}
export function createVacuumCupMesh(input: VacuumCupModelPropsInput = {}) {
  return geom3ToIndexedMesh(createVacuumCupGeom(input))
}
