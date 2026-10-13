import jscad from "@jscad/modeling"
import {
  sprocketModelPropsSchema,
  type SprocketModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
import { motionCylinder } from "../../mechanical/motion-geometry-utils"
const { union, subtract } = jscad.booleans
const { translate } = jscad.transforms
/** Chain-sprocket envelope with circular roller pockets between radial teeth, hub shoulder and through bore. Axis Z, bottom Z=0. Tooth/pocket outline is nominal, not a chain pitch standard, conjugate roller seating profile or cutting specification. */
export function createSprocketGeom(input: SprocketModelPropsInput = {}) {
  const p = sprocketModelPropsSchema.parse(input)

  // Circular roller pockets cut through the perimeter; the inward tangent is the
  // specified root circle. This is a nominal envelope, not a standard chain profile.
  const pocketRadius = ((p.outerDiameter - p.rootDiameter) / 2) * 0.6
  const pocketCenterRadius = p.rootDiameter / 2 + pocketRadius
  const pockets = Array.from({ length: p.toothCount }, (_, i) => {
    const angle = ((i + 0.5) * 2 * Math.PI) / p.toothCount
    return translate(
      [
        pocketCenterRadius * Math.cos(angle),
        pocketCenterRadius * Math.sin(angle),
        0,
      ],
      motionCylinder(pocketRadius * 2, p.width + 0.4, -0.2),
    )
  })
  const teeth = subtract(motionCylinder(p.outerDiameter, p.width), ...pockets)
  const hub = motionCylinder(p.hubDiameter, p.hubHeight, p.width)
  return subtract(
    union(teeth, hub),
    motionCylinder(p.boreDiameter, p.width + p.hubHeight + 0.4, -0.2),
  )
}
export function createSprocketMesh(input: SprocketModelPropsInput = {}) {
  return geom3ToIndexedMesh(createSprocketGeom(input))
}
