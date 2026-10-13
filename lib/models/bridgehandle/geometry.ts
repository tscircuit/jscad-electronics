import jscad from "@jscad/modeling"
import {
  bridgeHandleModelPropsSchema,
  type BridgeHandleModelPropsInput,
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
/** Bridge handle along X with two mounting feet and axial mounting holes; bottom Z=0. Nominal visual geometry; mating fits, thread forms and mechanisms are not certified. */
export function createBridgeHandleGeom(
  input: BridgeHandleModelPropsInput = {},
) {
  const p = bridgeHandleModelPropsSchema.parse(input)
  const x = p.length / 2 - p.mountingDiameter / 2
  const feet = [-1, 1].map((s) =>
    cut(
      cyl(p.mountingDiameter, p.mountingHeight, [
        s * x,
        0,
        p.mountingHeight / 2,
      ]),
      cyl(p.holeDiameter, p.mountingHeight + 2, [
        s * x,
        0,
        p.mountingHeight / 2,
      ]),
    ),
  )
  const legs = [-1, 1].map((s) =>
    cut(
      cyl(p.gripDiameter, p.height - p.gripDiameter / 2, [
        s * x,
        0,
        (p.height - p.gripDiameter / 2) / 2,
      ]),
      cyl(p.holeDiameter, p.mountingHeight + 1, [
        s * x,
        0,
        p.mountingHeight / 2,
      ]),
    ),
  )
  return join(
    ...feet,
    ...legs,
    cyl(p.gripDiameter, 2 * x, [0, 0, p.height - p.gripDiameter / 2], "x"),
  )
}
export function createBridgeHandleMesh(
  input: BridgeHandleModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createBridgeHandleGeom(input))
}
