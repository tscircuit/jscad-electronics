import jscad from "@jscad/modeling"
import {
  splitRingHangerModelPropsSchema,
  type SplitRingHangerModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
import {
  machineBox as box,
  machineCylinder as cyl,
  machineRod as rod,
  machineUnion as join,
  machineSubtract as cut,
  machineRotateZ as turn,
} from "../../mechanical/machine-hardware-primitives"
/** Nominal two-piece pipe hanger: pipe axis Y, horizontal split, lug bolt holes and top mounting boss. Nominal visual geometry; mating fits, thread forms and mechanisms are not certified. */
export function createSplitRingHangerGeom(
  input: SplitRingHangerModelPropsInput = {},
) {
  const p = splitRingHangerModelPropsSchema.parse(input)
  const od = p.pipeDiameter + 2 * p.bandThickness,
    r = od / 2
  const ring = cut(
    cyl(od, p.bandWidth, [0, 0, r], "y"),
    cyl(p.pipeDiameter, p.bandWidth + 2, [0, 0, r], "y"),
    box([od + 2, p.bandWidth + 2, p.gap], [0, 0, r]),
  )
  const lugX = r + p.lugWidth * 0.35
  const lugs = [-1, 1].flatMap((s) =>
    [-1, 1].map((t) =>
      cut(
        box(
          [p.lugWidth, p.bandWidth, p.bandThickness],
          [s * lugX, 0, r + t * (p.gap / 2 + p.bandThickness / 2)],
        ),
        cyl(p.holeDiameter, p.bandThickness + 2, [
          s * lugX,
          0,
          r + t * (p.gap / 2 + p.bandThickness / 2),
        ]),
      ),
    ),
  )
  const boss = cut(
    cyl(p.holeDiameter * 2.5, p.bandThickness * 3, [
      0,
      0,
      od + p.bandThickness,
    ]),
    cyl(p.holeDiameter, p.bandThickness * 3 + 2, [0, 0, od + p.bandThickness]),
  )
  return join(ring, ...lugs, boss)
}
export function createSplitRingHangerMesh(
  input: SplitRingHangerModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createSplitRingHangerGeom(input))
}
