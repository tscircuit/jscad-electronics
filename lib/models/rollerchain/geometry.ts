import jscad from "@jscad/modeling"
import {
  rollerChainModelPropsSchema,
  type RollerChainModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
import {
  motionCylinder,
  motionRing,
  motionBox,
  type MotionGeom3,
} from "../../mechanical/motion-geometry-utils"
const { union, subtract } = jscad.booleans
const { translate } = jscad.transforms
/** Straight roller-chain segment along X with alternating inner/outer side plates, discrete rollers and projecting rivet pins. Roller axes Z. Nominal pitch/width placement assembly; not a named chain standard or flexible/meshing simulation. */
export function createRollerChainGeom(input: RollerChainModelPropsInput = {}) {
  const p = rollerChainModelPropsSchema.parse(input)

  const parts: MotionGeom3[] = []
  const plateDiameter = p.rollerDiameter * 1.25
  const plate = (x: number, z: number) => {
    const ends = union(
      translate([x, 0, 0], motionCylinder(plateDiameter, p.plateThickness, z)),
      translate(
        [x + p.pitch, 0, 0],
        motionCylinder(plateDiameter, p.plateThickness, z),
      ),
      motionBox(p.pitch, plateDiameter, p.plateThickness, [
        x + p.pitch / 2,
        0,
        z + p.plateThickness / 2,
      ]),
    )
    return subtract(
      ends,
      ...[x, x + p.pitch].map((v) =>
        translate(
          [v, 0, 0],
          motionCylinder(p.pinDiameter, p.plateThickness + 0.4, z - 0.2),
        ),
      ),
    )
  }
  for (let link = 0; link < p.linkCount; link++) {
    const inner = link % 2 === 0
    const lower = inner ? p.plateThickness * 1.1 : 0
    const upper = inner
      ? p.width - p.plateThickness * 2.1
      : p.width - p.plateThickness
    parts.push(plate(link * p.pitch, lower), plate(link * p.pitch, upper))
  }
  for (let pin = 0; pin <= p.linkCount; pin++) {
    const x = pin * p.pitch
    parts.push(
      translate(
        [x, 0, 0],
        motionCylinder(
          p.pinDiameter,
          p.width + 2 * p.plateThickness,
          -p.plateThickness,
        ),
      ),
      translate(
        [x, 0, 0],
        motionRing(
          p.rollerDiameter,
          p.pinDiameter + 0.1,
          p.width - p.plateThickness * 4.4,
          p.plateThickness * 2.2,
        ),
      ),
    )
  }
  return union(...parts)
}
export function createRollerChainMesh(input: RollerChainModelPropsInput = {}) {
  return geom3ToIndexedMesh(createRollerChainGeom(input))
}
