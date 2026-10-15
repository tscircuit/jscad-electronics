import jscad from "@jscad/modeling"
import {
  wireDuctModelPropsSchema,
  type WireDuctModelPropsInput,
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

/** Open slotted wire duct with a continuous floor, two comb sidewalls and repeated bottom mounting holes. Length runs along X. The removable lid and flexible sidewall deformation are omitted. */
export function createWireDuctGeom(input: WireDuctModelPropsInput = {}) {
  const p = wireDuctModelPropsSchema.parse(input)
  const floor = box(p.length, p.width, p.thickness)
  const walls = [
    box(
      p.length,
      p.thickness,
      p.height,
      0,
      -p.width / 2 + p.thickness / 2,
      p.height / 2,
    ),
    box(
      p.length,
      p.thickness,
      p.height,
      0,
      p.width / 2 - p.thickness / 2,
      p.height / 2,
    ),
  ]
  const slots: Geom[] = []
  for (
    let x = -p.length / 2 + p.slotPitch / 2;
    x < p.length / 2;
    x += p.slotPitch
  )
    slots.push(
      box(
        p.slotWidth,
        p.width + 2,
        p.height - p.thickness * 4,
        x,
        0,
        (p.height + p.thickness * 4) / 2 + 0.1,
      ),
    )
  for (let x = -p.length / 2 + 15; x < p.length / 2 - 5; x += 25)
    slots.push(cyl(p.holeDiameter, p.thickness + 2, x, 0, p.thickness / 2))
  return subtract(union(floor, ...walls), ...slots)
}
export function createWireDuctMesh(input: WireDuctModelPropsInput = {}) {
  return geom3ToIndexedMesh(createWireDuctGeom(input))
}
