import jscad from "@jscad/modeling"
import {
  clevisModelPropsSchema,
  type ClevisModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
import {
  motionBox,
  motionCylinderY,
  motionCylinderX,
} from "../../mechanical/motion-geometry-utils"
const { subtract } = jscad.booleans
/** Fork clevis with parallel ears, shared cross-pin bore along X and rear mounting bore along Y. Rear plane Y=0, underside Z=0. Bores are smooth; pin/thread geometry and strength are not implied. */
export function createClevisGeom(input: ClevisModelPropsInput = {}) {
  const p = clevisModelPropsSchema.parse(input)

  const body = motionBox(p.width, p.length, p.height, [
    0,
    p.length / 2,
    p.height / 2,
  ])
  const slot = motionBox(
    p.gap,
    p.length - p.backThickness + 0.2,
    p.height + 0.4,
    [0, (p.length + p.backThickness) / 2 + 0.1, p.height / 2],
  )
  const pin = motionCylinderX(p.pinDiameter, p.width + 0.4, [
    0,
    p.length - p.pinDiameter,
    p.height / 2,
  ])
  const mount = motionCylinderY(p.mountDiameter, p.backThickness + 0.4, [
    0,
    p.backThickness / 2,
    p.height / 2,
  ])
  return subtract(body, slot, pin, mount)
}
export function createClevisMesh(input: ClevisModelPropsInput = {}) {
  return geom3ToIndexedMesh(createClevisGeom(input))
}
