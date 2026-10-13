import jscad from "@jscad/modeling"
import {
  expandedMetalModelPropsSchema,
  type ExpandedMetalModelPropsInput,
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
/** Flat expanded-metal visual sheet with staggered diamond apertures and perimeter frame; XY, bottom Z=0. Nominal visual geometry; mating fits, thread forms and mechanisms are not certified. */
export function createExpandedMetalGeom(
  input: ExpandedMetalModelPropsInput = {},
) {
  const p = expandedMetalModelPropsSchema.parse(input)
  const cuts: jscad.geometries.geom3.Geom3[] = []
  const dx = p.diamondWidth - 2 * p.strandWidth,
    dy = p.diamondLength - 2 * p.strandWidth
  const shape = jscad.extrusions.extrudeLinear(
    { height: p.thickness + 2 },
    jscad.primitives.polygon({
      points: [
        [0, -dy / 2],
        [dx / 2, 0],
        [0, dy / 2],
        [-dx / 2, 0],
      ],
    }),
  )
  const rows = Math.ceil(p.length / (p.diamondLength / 2)),
    cols = Math.ceil(p.width / p.diamondWidth)
  for (let row = -rows; row <= rows; row++)
    for (let col = -cols; col <= cols; col++) {
      const x =
          col * p.diamondWidth + ((Math.abs(row) % 2) * p.diamondWidth) / 2,
        y = (row * p.diamondLength) / 2
      if (
        Math.abs(x) + dx / 2 <= p.width / 2 - p.frameWidth &&
        Math.abs(y) + dy / 2 <= p.length / 2 - p.frameWidth
      )
        cuts.push(jscad.transforms.translate([x, y, -1], shape))
    }
  return cut(
    box([p.width, p.length, p.thickness], [0, 0, p.thickness / 2]),
    ...cuts,
  )
}
export function createExpandedMetalMesh(
  input: ExpandedMetalModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createExpandedMetalGeom(input))
}
