import jscad from "@jscad/modeling"
import {
  coolingFanModelPropsSchema,
  type CoolingFanModelPropsInput,
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
/** Nominal axial cooling fan with square shroud, four mount holes, curved-plan blades and support spokes; airflow axis Z. Nominal visual geometry; mating fits, thread forms and mechanisms are not certified. */
export function createCoolingFanGeom(input: CoolingFanModelPropsInput = {}) {
  const p = coolingFanModelPropsSchema.parse(input)
  const aperture = p.size / 2 - p.frameThickness
  const frame = cut(
    box([p.size, p.size, p.thickness], [0, 0, p.thickness / 2]),
    cyl(2 * aperture, p.thickness + 2, [0, 0, p.thickness / 2]),
    ...[-1, 1].flatMap((s) =>
      [-1, 1].map((t) =>
        cyl(p.mountingHoleDiameter, p.thickness + 2, [
          s * (p.size / 2 - p.frameThickness / 2),
          t * (p.size / 2 - p.frameThickness / 2),
          p.thickness / 2,
        ]),
      ),
    ),
  )
  const r = p.hubDiameter / 2,
    tip = aperture * 0.98,
    w = p.bladeWidth
  const blade = jscad.transforms.translate(
    [0, 0, p.thickness * 0.52],
    jscad.extrusions.extrudeLinear(
      { height: p.bladeThickness },
      jscad.primitives.polygon({
        points: [
          [r * 0.8, -w * 0.18],
          [tip, -w * 0.38],
          [tip * 0.93, w * 0.62],
          [r * 0.8, w * 0.28],
        ],
      }),
    ),
  )
  const blades = Array.from({ length: p.bladeCount }, (_, i) =>
    turn((i * 2 * Math.PI) / p.bladeCount, blade),
  )
  const supports = Array.from({ length: 4 }, (_, i) =>
    turn(
      (i * Math.PI) / 2,
      box(
        [
          aperture + p.frameThickness / 2,
          p.frameThickness * 0.65,
          p.bladeThickness,
        ],
        [aperture / 2, 0, p.thickness * 0.16],
      ),
    ),
  )
  return join(
    frame,
    cyl(p.hubDiameter, p.thickness * 0.78, [0, 0, p.thickness * 0.48]),
    ...blades,
    ...supports,
  )
}
export function createCoolingFanMesh(input: CoolingFanModelPropsInput = {}) {
  return geom3ToIndexedMesh(createCoolingFanGeom(input))
}
