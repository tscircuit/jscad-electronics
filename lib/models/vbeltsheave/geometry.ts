import jscad from "@jscad/modeling"
import {
  vBeltSheaveModelPropsSchema,
  type VBeltSheaveModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
import {
  motionRing,
  motionRevolve,
} from "../../mechanical/motion-geometry-utils"
const { union } = jscad.booleans
/** Multi-groove V-belt sheave with sloped circumferential groove flanks, small root land, hub and through bore. Axis Z, bottom Z=0. Nominal groove envelope; belt section standard, taper bushing and keyway are not specified. */
export function createVBeltSheaveGeom(input: VBeltSheaveModelPropsInput = {}) {
  const p = vBeltSheaveModelPropsSchema.parse(input)

  const outer = p.outerDiameter / 2,
    root = outer - p.grooveDepth
  const points: [number, number][] = [
    [p.boreDiameter / 2, 0],
    [outer, 0],
  ]
  const spacing = p.width / p.grooveCount
  for (let i = 0; i < p.grooveCount; i++) {
    const center = spacing * (i + 0.5)
    points.push(
      [outer, center - p.grooveWidth / 2],
      [root, center - p.grooveWidth * 0.1],
      [root, center + p.grooveWidth * 0.1],
      [outer, center + p.grooveWidth / 2],
    )
  }
  points.push([outer, p.width], [p.boreDiameter / 2, p.width])
  return union(
    motionRevolve(points),
    motionRing(p.hubDiameter, p.boreDiameter, p.hubHeight, p.width),
  )
}
export function createVBeltSheaveMesh(input: VBeltSheaveModelPropsInput = {}) {
  return geom3ToIndexedMesh(createVBeltSheaveGeom(input))
}
