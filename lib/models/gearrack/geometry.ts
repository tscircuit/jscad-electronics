import jscad from "@jscad/modeling"
import {
  gearRackModelPropsSchema,
  type GearRackModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
import {
  motionCylinder,
  motionBox,
} from "../../mechanical/motion-geometry-utils"
const { primitives, extrusions } = jscad
const { union, subtract } = jscad.booleans
const { translate, rotateX } = jscad.transforms
/** Straight rack envelope along X with trapezoidal teeth above a mounting bar and two vertical mounting holes. Base underside Z=0. Teeth are nominal placement geometry, not conjugate involute teeth or a machining standard. */
export function createGearRackGeom(input: GearRackModelPropsInput = {}) {
  const p = gearRackModelPropsSchema.parse(input)

  const length = p.pitch * p.toothCount
  const base = motionBox(length, p.width, p.baseHeight, [
    0,
    0,
    p.baseHeight / 2,
  ])
  const tooth = extrusions.extrudeLinear(
    { height: p.width },
    primitives.polygon({
      points: [
        [-p.pitch * 0.4, 0],
        [p.pitch * 0.4, 0],
        [p.pitch * 0.18, p.toothHeight],
        [-p.pitch * 0.18, p.toothHeight],
      ],
    }),
  )
  const teeth = Array.from({ length: p.toothCount }, (_, i) =>
    translate(
      [-length / 2 + p.pitch * (i + 0.5), p.width / 2, p.baseHeight],
      rotateX(Math.PI / 2, tooth),
    ),
  )
  const body = union(base, ...teeth)
  return subtract(
    body,
    ...[-1, 1].map((side) =>
      translate(
        [side * (length / 2 - p.pitch / 2), 0, 0],
        motionCylinder(
          p.mountHoleDiameter,
          p.baseHeight + p.toothHeight + 0.4,
          -0.2,
        ),
      ),
    ),
  )
}
export function createGearRackMesh(input: GearRackModelPropsInput = {}) {
  return geom3ToIndexedMesh(createGearRackGeom(input))
}
