import jscad from "@jscad/modeling"
import {
  flowMeterModelPropsSchema,
  type FlowMeterModelPropsInput,
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

/** Vertical variable-area flowmeter with hollow end fittings, a rear tube wall, visible float and scale ticks. The front wall is intentionally cut away to show the nominal internal float through the inspection window; this is an explanatory envelope model rather than a closed pressure vessel. */
export function createFlowMeterGeom(input: FlowMeterModelPropsInput = {}) {
  const p = flowMeterModelPropsSchema.parse(input)
  const tube = ring(
    p.diameter,
    p.boreDiameter,
    p.length - 2 * p.endLength,
    0,
    0,
    p.length / 2,
  )
  const ends = [
    ring(p.endDiameter, p.boreDiameter, p.endLength),
    ring(
      p.endDiameter,
      p.boreDiameter,
      p.endLength,
      0,
      0,
      p.length - p.endLength / 2,
    ),
  ]
  const window = box(
    p.diameter,
    p.diameter,
    p.length * 0.65,
    0,
    -p.diameter / 2,
    p.length / 2,
  )
  const float = cyl(p.floatDiameter, p.floatDiameter, 0, 0, p.length * 0.4)
  const ticks: Geom[] = []
  for (let i = 0; i < 7; i++)
    ticks.push(
      box(
        p.diameter * 0.12,
        2,
        1,
        p.diameter * 0.37,
        -p.boreDiameter * 0.35,
        p.length * 0.25 + i * p.length * 0.08,
      ),
    )
  return union(subtract(tube, window), ...ends, float, ...ticks)
}
export function createFlowMeterMesh(input: FlowMeterModelPropsInput = {}) {
  return geom3ToIndexedMesh(createFlowMeterGeom(input))
}
