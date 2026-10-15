import jscad from "@jscad/modeling"
import {
  drawLatchModelPropsSchema,
  type DrawLatchModelPropsInput,
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
/** Nominal closed draw latch with base, handle, wire bail and keeper; long axis X. Nominal visual geometry; mating fits, thread forms and mechanisms are not certified. */
export function createDrawLatchGeom(input: DrawLatchModelPropsInput = {}) {
  const p = drawLatchModelPropsSchema.parse(input)
  const base = cut(
    box(
      [p.length * 0.38, p.width, p.baseThickness],
      [-p.length * 0.27, 0, p.baseThickness / 2],
    ),
    ...[-1, 1].map((s) =>
      cyl(p.holeDiameter, p.baseThickness + 2, [
        -p.length * 0.38,
        s * p.width * 0.3,
        p.baseThickness / 2,
      ]),
    ),
  )
  const keeper = cut(
    box(
      [p.length * 0.18, p.width, p.baseThickness],
      [p.length * 0.41, 0, p.baseThickness / 2],
    ),
    ...[-1, 1].map((s) =>
      cyl(p.holeDiameter, p.baseThickness + 2, [
        p.length * 0.43,
        s * p.width * 0.3,
        p.baseThickness / 2,
      ]),
    ),
  )
  const handle = box(
    [p.length * 0.36, p.width * 0.7, p.wireDiameter],
    [-p.length * 0.15, 0, p.handleHeight - p.wireDiameter / 2],
  )
  const bail = [-1, 1].map((s) =>
    rod(
      [-p.length * 0.1, s * p.width * 0.26, p.handleHeight],
      [p.length * 0.34, s * p.width * 0.26, p.baseThickness + p.wireDiameter],
      p.wireDiameter,
    ),
  )
  return join(
    base,
    keeper,
    handle,
    ...bail,
    cyl(
      p.wireDiameter,
      p.width * 0.72,
      [-p.length * 0.31, 0, p.handleHeight],
      "y",
    ),
    cyl(
      p.wireDiameter,
      p.width * 0.65,
      [p.length * 0.34, 0, p.baseThickness + p.wireDiameter],
      "y",
    ),
    rod(
      [-p.length * 0.31, 0, p.baseThickness],
      [-p.length * 0.31, 0, p.handleHeight],
      p.wireDiameter,
    ),
  )
}
export function createDrawLatchMesh(input: DrawLatchModelPropsInput = {}) {
  return geom3ToIndexedMesh(createDrawLatchGeom(input))
}
