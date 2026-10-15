import jscad from "@jscad/modeling"
import {
  toggleClampModelPropsSchema,
  type ToggleClampModelPropsInput,
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
/** Nominal closed hold-down toggle clamp, long axis X, handle upright, bottom Z=0. Nominal visual geometry; mating fits, thread forms and mechanisms are not certified. */
export function createToggleClampGeom(input: ToggleClampModelPropsInput = {}) {
  const p = toggleClampModelPropsSchema.parse(input)
  const base = cut(
    box(
      [p.length * 0.55, p.width, p.baseThickness],
      [-p.length * 0.2, 0, p.baseThickness / 2],
    ),
    ...[-1, 1].flatMap((s) =>
      [-1, 1].map((t) =>
        cyl(p.holeDiameter, p.baseThickness + 2, [
          -p.length * 0.2 + s * p.length * 0.19,
          t * p.width * 0.3,
          p.baseThickness / 2,
        ]),
      ),
    ),
  )
  const pivotZ = p.width * 0.62
  const pivotX = -p.length * 0.12
  const cheeks = [-1, 1].map((s) =>
    box(
      [p.width * 0.48, p.baseThickness, pivotZ],
      [pivotX, s * p.width * 0.25, pivotZ / 2],
    ),
  )
  const arm = box(
    [p.armLength, p.width * 0.22, p.baseThickness],
    [pivotX + p.armLength / 2, 0, pivotZ],
  )
  const handle = rod(
    [pivotX, 0, pivotZ],
    [pivotX - p.length * 0.24, 0, p.handleHeight],
    p.width * 0.2,
  )
  const handleGrip = rod(
    [pivotX - p.length * 0.18, 0, p.handleHeight * 0.8],
    [pivotX - p.length * 0.24, 0, p.handleHeight],
    p.width * 0.32,
  )
  const padX = pivotX + p.armLength * 0.88
  return join(
    base,
    ...cheeks,
    arm,
    handle,
    handleGrip,
    cyl(p.baseThickness, p.width * 0.65, [pivotX, 0, pivotZ], "y"),
    cyl(p.baseThickness, pivotZ * 0.8, [padX, 0, pivotZ * 0.55]),
    cyl(p.padDiameter, p.baseThickness, [padX, 0, p.baseThickness / 2]),
    rod(
      [pivotX - p.length * 0.18, 0, pivotZ],
      [pivotX - p.length * 0.14, 0, p.handleHeight * 0.72],
      p.baseThickness,
    ),
  )
}
export function createToggleClampMesh(input: ToggleClampModelPropsInput = {}) {
  return geom3ToIndexedMesh(createToggleClampGeom(input))
}
