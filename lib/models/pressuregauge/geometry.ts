import jscad from "@jscad/modeling"
import {
  pressureGaugeModelPropsSchema,
  type PressureGaugeModelPropsInput,
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

/** Round pressure gauge facing -Y with a recessed dial, eleven major tick marks and a fixed nominal needle. The bottom stem is bored. Tick marks are decorative and intentionally have no numbers or calibration. */
export type PressureGaugePart = {
  name: string
  geometry: Geom
  color: [number, number, number]
}
export function createPressureGaugeParts(
  input: PressureGaugeModelPropsInput = {},
): PressureGaugePart[] {
  const p = pressureGaugeModelPropsSchema.parse(input)
  const centerZ = p.stemLength + p.diameter / 2
  const housing = cy(p.diameter, p.depth, 0, 0, centerZ)
  const face = cy(
    p.diameter * 0.86,
    p.depth * 0.15,
    0,
    -p.depth * 0.44,
    centerZ,
  )
  const bezel = subtract(
    cy(p.diameter, p.depth * 0.15, 0, -p.depth * 0.44, centerZ),
    cy(p.diameter * 0.9, p.depth * 0.2, 0, -p.depth * 0.44, centerZ),
  )
  const ticks: Geom[] = []
  for (let i = 0; i <= 10; i++) {
    const a = -Math.PI * 0.75 + (i * Math.PI * 1.5) / 10
    const r = p.diameter * 0.36
    ticks.push(
      translate(
        [Math.sin(a) * r, -p.depth / 2 - 0.7, centerZ + Math.cos(a) * r],
        rotateY(a, box(1, 1, p.diameter * 0.065, 0, 0, 0)),
      ),
    )
  }
  const needle = translate(
    [0, -p.depth / 2 - 1, centerZ],
    rotateY(
      -Math.PI / 4,
      box(1.5, 1, p.diameter * 0.3, 0, 0, p.diameter * 0.12),
    ),
  )
  const stem = subtract(
    cyl(p.stemDiameter, p.stemLength),
    cyl(p.stemDiameter * 0.45, p.stemLength + 2),
  )
  return [
    {
      name: "case and pressure connection",
      geometry: union(subtract(housing, face), bezel, stem),
      color: [0.57, 0.62, 0.66],
    },
    {
      name: "dial face",
      geometry: cy(p.diameter * 0.86, 1, 0, -p.depth / 2 + 1, centerZ),
      color: [0.96, 0.96, 0.92],
    },
    {
      name: "needle and scale",
      geometry: union(needle, ...ticks),
      color: [0.035, 0.045, 0.055],
    },
  ]
}
export function createPressureGaugeGeom(
  input: PressureGaugeModelPropsInput = {},
) {
  return union(...createPressureGaugeParts(input).map((part) => part.geometry))
}
export function createPressureGaugeMesh(
  input: PressureGaugeModelPropsInput = {},
) {
  const parts = createPressureGaugeParts(input)
  return {
    ...geom3ToIndexedMesh(union(...parts.map((part) => part.geometry))),
    parts: parts.map(({ geometry, ...part }) => ({
      ...part,
      mesh: geom3ToIndexedMesh(geometry),
    })),
  }
}
