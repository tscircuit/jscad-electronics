import jscad from "@jscad/modeling"
import {
  camFollowerModelPropsSchema,
  type CamFollowerModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
import {
  motionCylinder,
  motionRing,
} from "../../mechanical/motion-geometry-utils"
const { primitives } = jscad
const { union, subtract } = jscad.booleans
const { translate } = jscad.transforms
/** Stud-mounted cam follower with an exposed open roller race and hex drive socket. Stud is on Z, from Z=0 to studLength; wheel sits above it. Smooth stud represents the thread major-diameter envelope, not a screw thread. */
export function createCamFollowerGeom(input: CamFollowerModelPropsInput = {}) {
  const p = camFollowerModelPropsSchema.parse(input)

  const shaft = motionCylinder(p.studDiameter, p.studLength + p.wheelWidth)
  const raceInnerOD = p.studDiameter * 1.45
  const raceOuterID = p.wheelDiameter * 0.82
  const rollerDiameter = ((raceOuterID - raceInnerOD) / 2) * 0.8
  const trackRadius = (raceOuterID + raceInnerOD) / 4
  const wheel = union(
    motionRing(p.wheelDiameter, raceOuterID, p.wheelWidth, p.studLength),
    motionRing(raceInnerOD, p.studDiameter, p.wheelWidth, p.studLength),
    motionRing(
      p.wheelDiameter,
      p.studDiameter,
      p.wheelWidth * 0.1,
      p.studLength,
    ),
    ...Array.from({ length: p.rollerCount }, (_, i) => {
      const a = (i * 2 * Math.PI) / p.rollerCount
      return translate(
        [trackRadius * Math.cos(a), trackRadius * Math.sin(a), 0],
        motionCylinder(
          rollerDiameter,
          p.wheelWidth * 0.72,
          p.studLength + p.wheelWidth * 0.18,
        ),
      )
    }),
  )
  const socket = primitives.cylinder({
    radius: p.socketDiameter / 2,
    height: p.socketDiameter,
    center: [0, 0, p.studLength + p.wheelWidth],
    segments: 6,
  })
  return subtract(union(shaft, wheel), socket)
}
export function createCamFollowerMesh(input: CamFollowerModelPropsInput = {}) {
  return geom3ToIndexedMesh(createCamFollowerGeom(input))
}
