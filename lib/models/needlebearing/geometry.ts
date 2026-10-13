import jscad from "@jscad/modeling"
import {
  needleBearingModelPropsSchema,
  type NeedleBearingModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
import {
  motionCylinder,
  motionRing,
} from "../../mechanical/motion-geometry-utils"
const { union } = jscad.booleans
const { translate } = jscad.transforms
/** Open straight-needle radial bearing. Axis is Z and lower face is Z=0. Inner and outer races enclose separately visible axial needles. Roller sizes/clearances are nominal and do not define a bearing standard or rating. */
export function createNeedleBearingGeom(
  input: NeedleBearingModelPropsInput = {},
) {
  const p = needleBearingModelPropsSchema.parse(input)

  const innerRaceOD = p.innerDiameter + 2 * p.raceThickness
  const outerRaceID = p.outerDiameter - 2 * p.raceThickness
  const rollerDiameter = ((outerRaceID - innerRaceOD) / 2) * 0.85
  const trackRadius = (outerRaceID + innerRaceOD) / 4
  return union(
    motionRing(p.outerDiameter, outerRaceID, p.width),
    motionRing(innerRaceOD, p.innerDiameter, p.width),
    ...Array.from({ length: p.rollerCount }, (_, i) => {
      const a = (i * 2 * Math.PI) / p.rollerCount
      return translate(
        [trackRadius * Math.cos(a), trackRadius * Math.sin(a), 0],
        motionCylinder(rollerDiameter, p.width * 0.84, p.width * 0.08),
      )
    }),
  )
}
export function createNeedleBearingMesh(
  input: NeedleBearingModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createNeedleBearingGeom(input))
}
