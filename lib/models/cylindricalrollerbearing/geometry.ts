import jscad from "@jscad/modeling"
import {
  cylindricalRollerBearingModelPropsSchema,
  type CylindricalRollerBearingModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
import {
  motionCylinder,
  motionRing,
} from "../../mechanical/motion-geometry-utils"
const { union } = jscad.booleans
const { translate } = jscad.transforms
/** Open cylindrical-roller radial bearing with short axial rollers between inner and outer races and an outer retaining lip. Axis Z, bottom Z=0. Assembly envelope only; cage/preload and load rating are not specified. */
export function createCylindricalRollerBearingGeom(
  input: CylindricalRollerBearingModelPropsInput = {},
) {
  const p = cylindricalRollerBearingModelPropsSchema.parse(input)

  const innerRaceOD = p.innerDiameter + 2 * p.raceThickness
  const outerRaceID = p.outerDiameter - 2 * p.raceThickness
  const rollerDiameter = ((outerRaceID - innerRaceOD) / 2) * 0.85
  const trackRadius = (outerRaceID + innerRaceOD) / 4
  const lipHeight = p.width * 0.08
  return union(
    motionRing(p.outerDiameter, outerRaceID, p.width),
    motionRing(innerRaceOD, p.innerDiameter, p.width),
    motionRing(p.outerDiameter, outerRaceID - rollerDiameter * 0.28, lipHeight),
    ...Array.from({ length: p.rollerCount }, (_, i) => {
      const a = (i * 2 * Math.PI) / p.rollerCount
      return translate(
        [trackRadius * Math.cos(a), trackRadius * Math.sin(a), 0],
        motionCylinder(rollerDiameter, p.width * 0.7, p.width * 0.15),
      )
    }),
  )
}
export function createCylindricalRollerBearingMesh(
  input: CylindricalRollerBearingModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createCylindricalRollerBearingGeom(input))
}
