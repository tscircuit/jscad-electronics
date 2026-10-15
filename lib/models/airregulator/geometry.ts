import jscad from "@jscad/modeling"
import {
  airRegulatorModelPropsSchema,
  type AirRegulatorModelPropsInput,
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

/** Air pressure regulator with a fluted adjustment knob, front gauge bezel and lateral through ports. The head and gauge are nominal visual envelopes; concealed diaphragm and calibrated gauge markings are omitted. */
export function createAirRegulatorGeom(
  input: AirRegulatorModelPropsInput = {},
) {
  const p = airRegulatorModelPropsSchema.parse(input)
  const body = box(p.bodyWidth, p.bodyDepth, p.bodyHeight)
  const knob = cyl(
    p.knobDiameter,
    p.knobHeight,
    0,
    0,
    p.bodyHeight + p.knobHeight / 2,
  )
  const flutes: Geom[] = []
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6
    flutes.push(
      cyl(
        p.knobDiameter * 0.05,
        p.knobHeight * 0.8,
        Math.cos(a) * p.knobDiameter * 0.48,
        Math.sin(a) * p.knobDiameter * 0.48,
        p.bodyHeight + p.knobHeight / 2,
      ),
    )
  }
  const gauge = cy(
    p.gaugeDiameter,
    6,
    0,
    -p.bodyDepth / 2 - 2,
    p.bodyHeight / 2,
  )
  const recess = cy(
    p.gaugeDiameter * 0.75,
    2,
    0,
    -p.bodyDepth / 2 - 4.5,
    p.bodyHeight / 2,
  )
  return subtract(
    union(body, knob, gauge, ...flutes),
    cx(p.portDiameter, p.bodyWidth + 2, 0, 0, p.bodyHeight / 2),
    recess,
  )
}
export function createAirRegulatorMesh(
  input: AirRegulatorModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createAirRegulatorGeom(input))
}
