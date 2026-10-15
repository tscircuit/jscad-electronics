import jscad from "@jscad/modeling"
import {
  dinRailModelPropsSchema,
  type DinRailModelPropsInput,
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

/** Generic top-hat DIN rail with a central floor, upright webs, outturned flanges and repeated oblong mounting holes. Rail length runs along X and the section width is Y. Dimensions are nominal; this model does not assert compliance with a rail standard. */
export function createDinRailGeom(input: DinRailModelPropsInput = {}) {
  const p = dinRailModelPropsSchema.parse(input)
  const baseWidth = p.width * 0.55
  const floor = box(p.length, baseWidth, p.thickness)
  const walls = [
    box(
      p.length,
      p.thickness,
      p.height,
      0,
      -baseWidth / 2 + p.thickness / 2,
      p.height / 2,
    ),
    box(
      p.length,
      p.thickness,
      p.height,
      0,
      baseWidth / 2 - p.thickness / 2,
      p.height / 2,
    ),
  ]
  const flanges = [
    box(
      p.length,
      (p.width - baseWidth) / 2 + p.thickness,
      p.thickness,
      0,
      -(p.width + baseWidth) / 4 + p.thickness / 2,
      p.height - p.thickness / 2,
    ),
    box(
      p.length,
      (p.width - baseWidth) / 2 + p.thickness,
      p.thickness,
      0,
      (p.width + baseWidth) / 4 - p.thickness / 2,
      p.height - p.thickness / 2,
    ),
  ]
  const holes: Geom[] = []
  for (
    let x = -p.length / 2 + p.slotPitch / 2;
    x <= p.length / 2 - p.slotPitch / 2;
    x += p.slotPitch
  ) {
    const straight = p.slotLength - p.holeDiameter
    holes.push(
      union(
        box(
          Math.max(straight, 0.01),
          p.holeDiameter,
          p.thickness + 2,
          x,
          0,
          p.thickness / 2,
        ),
        cyl(
          p.holeDiameter,
          p.thickness + 2,
          x - straight / 2,
          0,
          p.thickness / 2,
        ),
        cyl(
          p.holeDiameter,
          p.thickness + 2,
          x + straight / 2,
          0,
          p.thickness / 2,
        ),
      ),
    )
  }
  return subtract(union(floor, ...walls, ...flanges), ...holes)
}
export function createDinRailMesh(input: DinRailModelPropsInput = {}) {
  return geom3ToIndexedMesh(createDinRailGeom(input))
}
