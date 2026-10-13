import jscad from "@jscad/modeling"
import {
  detentPinModelPropsSchema,
  type DetentPinModelPropsInput,
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
/** Nominal ball detent pin, shaft Z, transverse pull ring in XZ; mechanism internals omitted. Nominal visual geometry; mating fits, thread forms and mechanisms are not certified. */
export function createDetentPinGeom(input: DetentPinModelPropsInput = {}) {
  const p = detentPinModelPropsSchema.parse(input)
  const balls = [-1, 1].map((s) =>
    jscad.primitives.sphere({
      radius: p.ballDiameter / 2,
      segments: 32,
      center: [s * p.shaftDiameter * 0.47, 0, p.ballOffset],
    }),
  )
  const ring = jscad.transforms.translate(
    [0, 0, p.shaftLength + p.headHeight + p.ringDiameter / 2 - p.ringWire],
    jscad.transforms.rotateX(
      Math.PI / 2,
      jscad.primitives.torus({
        innerRadius: p.ringWire / 2,
        outerRadius: (p.ringDiameter - p.ringWire) / 2,
        innerSegments: 16,
        outerSegments: 48,
      }),
    ),
  )
  return join(
    cyl(p.shaftDiameter, p.shaftLength, [0, 0, p.shaftLength / 2]),
    cyl(p.headDiameter, p.headHeight, [0, 0, p.shaftLength + p.headHeight / 2]),
    ...balls,
    ring,
  )
}
export function createDetentPinMesh(input: DetentPinModelPropsInput = {}) {
  return geom3ToIndexedMesh(createDetentPinGeom(input))
}
