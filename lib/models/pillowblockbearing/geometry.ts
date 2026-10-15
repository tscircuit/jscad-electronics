import jscad from "@jscad/modeling"
import {
  pillowBlockBearingModelPropsSchema,
  type PillowBlockBearingModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
import {
  motionCylinder,
  motionRing,
  motionBox,
  motionCylinderY,
} from "../../mechanical/motion-geometry-utils"
const { primitives } = jscad
const { union, subtract } = jscad.booleans
const { translate, rotateX } = jscad.transforms
/** Mounted radial bearing in a raised pillow housing. Shaft axis is Y; the mounting-foot bottom is Z=0. Open front race shows rolling elements. Clearance, cage and grease hardware are nominal; no load rating is implied. */
export function createPillowBlockBearingGeom(
  input: PillowBlockBearingModelPropsInput = {},
) {
  const p = pillowBlockBearingModelPropsSchema.parse(input)

  const housing = union(
    motionBox(p.baseWidth, p.baseDepth, p.baseThickness, [
      0,
      0,
      p.baseThickness / 2,
    ]),
    motionBox(
      p.housingDiameter * 0.78,
      p.baseDepth,
      p.centerHeight - p.baseThickness,
      [0, 0, (p.centerHeight + p.baseThickness) / 2],
    ),
    motionCylinderY(p.housingDiameter, p.baseDepth, [0, 0, p.centerHeight]),
  )
  const raceOuter = p.boreDiameter + (p.housingDiameter - p.boreDiameter) * 0.62
  const bearingPocket = motionCylinderY(raceOuter, p.baseDepth + 0.4, [
    0,
    0,
    p.centerHeight,
  ])
  const mounted = subtract(
    housing,
    bearingPocket,
    ...[-1, 1].map((side) =>
      translate(
        [(side * p.mountSpacing) / 2, 0, 0],
        motionCylinder(p.mountHoleDiameter, p.baseThickness + 0.4, -0.2),
      ),
    ),
  )
  const bearing = union(
    motionRing(raceOuter + 0.04, raceOuter - 3, p.baseDepth + 2),
    motionRing(p.boreDiameter + 3, p.boreDiameter, p.baseDepth + 2),
    ...Array.from({ length: 10 }, (_, i) => {
      const angle = (i * 2 * Math.PI) / 10
      const trackRadius = (raceOuter + p.boreDiameter) / 4
      const ballRadius = ((raceOuter - p.boreDiameter - 6) / 4) * 0.85
      return primitives.sphere({
        radius: ballRadius,
        segments: 16,
        center: [
          trackRadius * Math.cos(angle),
          trackRadius * Math.sin(angle),
          p.baseDepth + 1 - ballRadius,
        ],
      })
    }),
  )
  return union(
    mounted,
    translate(
      [0, (p.baseDepth + 2) / 2, p.centerHeight],
      rotateX(Math.PI / 2, bearing),
    ),
  )
}
export function createPillowBlockBearingMesh(
  input: PillowBlockBearingModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createPillowBlockBearingGeom(input))
}
