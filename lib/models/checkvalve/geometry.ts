import jscad from "@jscad/modeling"
import {
  checkValveModelPropsSchema,
  type CheckValveModelPropsInput,
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
export function createCheckValveGeom(input: CheckValveModelPropsInput = {}) {
  const p = checkValveModelPropsSchema.parse(input)
  const e = overrun(Math.max(...Object.values(p)))
  const arrowHead = jscad.transforms.translate(
    [p.outerDiameter * 0.14, -p.outerDiameter / 2 + p.outerDiameter * 0.03, 0],
    jscad.transforms.rotateX(
      Math.PI / 2,
      jscad.extrusions.extrudeLinear(
        { height: p.outerDiameter * 0.08 },
        jscad.primitives.polygon({
          points: [
            [-p.outerDiameter * 0.1, -p.outerDiameter * 0.13],
            [p.outerDiameter * 0.16, 0],
            [-p.outerDiameter * 0.1, p.outerDiameter * 0.13],
          ],
        }),
      ),
    ),
  )
  const shell = union(
    solidX(p.endDiameter, p.length),
    solidX(p.outerDiameter, p.length - 2 * p.nutLength),
    ...[-1, 1].map((side) =>
      hexX(
        p.hexAcrossFlats,
        p.nutLength,
        (side * (p.length - p.nutLength)) / 2,
      ),
    ),
    solidZ(
      p.outerDiameter * 0.5,
      p.outerDiameter * 0.22,
      0,
      0,
      p.outerDiameter / 2,
    ),
    box({
      size: [
        p.outerDiameter * 0.35,
        p.outerDiameter * 0.07,
        p.outerDiameter * 0.09,
      ],
      center: [-p.outerDiameter * 0.05, -p.outerDiameter / 2, 0],
    }),
    arrowHead,
  )

  return subtract(shell, solidX(p.boreDiameter, p.length + e))
}
export function createCheckValveMesh(input: CheckValveModelPropsInput = {}) {
  return geom3ToIndexedMesh(createCheckValveGeom(input))
}
