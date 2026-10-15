import jscad from "@jscad/modeling"
import {
  ballValveModelPropsSchema,
  type BallValveModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
import {
  union,
  subtract,
  box,
  sphere,
  solidX,
  solidY,
  solidZ,
  hexX,
  taperX,
  overrun,
} from "../../mechanical/plumbing-shapes"
/** Nominal envelope centered on its flow axis. Threads use smooth envelopes. */
export function createBallValveGeom(input: BallValveModelPropsInput = {}) {
  const p = ballValveModelPropsSchema.parse(input)
  const e = overrun(Math.max(...Object.values(p)))
  const shell = union(
    solidX(p.endDiameter, p.length),
    sphere({ radius: p.outerDiameter / 2, segments: 32 }),
    ...[-1, 1].map((side) =>
      hexX(p.outerDiameter, p.length * 0.16, side * p.length * 0.35),
    ),
    solidZ(
      p.handleWidth * 0.8,
      p.stemHeight,
      0,
      0,
      p.outerDiameter / 2 + p.stemHeight / 2 - e,
    ),
    box({
      size: [p.handleLength, p.handleWidth, p.handleThickness],
      center: [
        p.handleLength / 2 - p.handleWidth / 2,
        0,
        p.outerDiameter / 2 + p.stemHeight,
      ],
    }),
  )
  return subtract(shell, solidX(p.boreDiameter, p.length + e))
}
export function createBallValveMesh(input: BallValveModelPropsInput = {}) {
  return geom3ToIndexedMesh(createBallValveGeom(input))
}
