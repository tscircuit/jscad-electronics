import jscad from "@jscad/modeling"
import {
  pilotLightModelPropsSchema,
  type PilotLightModelPropsInput,
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

/** Panel indicator light with raised lens, surrounding bezel, mounting barrel and two rear terminal tabs. Optical diffusion and illumination are not simulated; no electrical ratings or mounting thread are asserted. */
export function createPilotLightGeom(input: PilotLightModelPropsInput = {}) {
  const p = pilotLightModelPropsSchema.parse(input)
  const body = cyl(p.panelDiameter, p.bodyLength)
  const bezel = ring(
    p.lensDiameter + 3,
    p.lensDiameter,
    3,
    0,
    0,
    p.bodyLength + 1.5,
  )
  const lens = cyl(
    p.lensDiameter,
    p.lensHeight,
    0,
    0,
    p.bodyLength + p.lensHeight / 2,
  )
  const lugs = [
    box(3, 1, 6, -p.panelDiameter * 0.25, 0, -3),
    box(3, 1, 6, p.panelDiameter * 0.25, 0, -3),
  ]
  return union(body, bezel, lens, ...lugs)
}
export function createPilotLightMesh(input: PilotLightModelPropsInput = {}) {
  return geom3ToIndexedMesh(createPilotLightGeom(input))
}
