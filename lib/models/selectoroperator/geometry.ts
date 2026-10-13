import jscad from "@jscad/modeling"
import {
  selectorOperatorModelPropsSchema,
  type SelectorOperatorModelPropsInput,
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

/** Panel selector switch operator with mounting barrel, bezel, raised bar grip and two rear terminals. The grip is aligned with X at its nominal position; detents and switching contacts are omitted. */
export function createSelectorOperatorGeom(
  input: SelectorOperatorModelPropsInput = {},
) {
  const p = selectorOperatorModelPropsSchema.parse(input)
  const body = cyl(p.panelDiameter, p.bodyLength)
  const bezel = cyl(p.bezelDiameter, 3, 0, 0, p.bodyLength + 1.5)
  const boss = cyl(
    p.panelDiameter * 0.7,
    p.knobHeight * 0.5,
    0,
    0,
    p.bodyLength + 3 + p.knobHeight * 0.25,
  )
  const grip = box(
    p.knobWidth,
    p.knobDepth,
    p.knobHeight,
    0,
    0,
    p.bodyLength + 3 + p.knobHeight / 2,
  )
  const lugs = [
    box(3, 1, 7, -p.panelDiameter * 0.25, 0, -3.5),
    box(3, 1, 7, p.panelDiameter * 0.25, 0, -3.5),
  ]
  return union(body, bezel, boss, grip, ...lugs)
}
export function createSelectorOperatorMesh(
  input: SelectorOperatorModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createSelectorOperatorGeom(input))
}
