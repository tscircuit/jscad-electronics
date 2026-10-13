import jscad from "@jscad/modeling"
import {
  hoseClampModelPropsSchema,
  type HoseClampModelPropsInput,
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
export function createHoseClampGeom(input: HoseClampModelPropsInput = {}) {
  const p = hoseClampModelPropsSchema.parse(input)
  const e = overrun(Math.max(...Object.values(p)))
  const outer = p.innerDiameter + p.bandThickness * 2
  const band = subtract(
    solidZ(outer, p.bandWidth),
    solidZ(p.innerDiameter, p.bandWidth + e),
  )
  const housing = box({
    size: [p.housingLength, p.housingWidth, p.housingHeight],
    center: [0, outer / 2 + p.housingWidth * 0.3, 0],
  })
  const screw = union(
    solidX(
      p.housingHeight * 0.55,
      p.housingLength * 1.25,
      0,
      outer / 2 + p.housingWidth * 0.3,
      0,
    ),
    hexX(
      p.housingHeight * 0.8,
      p.housingHeight * 0.3,
      p.housingLength * 0.65,
      outer / 2 + p.housingWidth * 0.3,
    ),
  )
  const slots = Array.from({ length: 8 }, (_, i) => {
    const angle = (Math.PI * (i + 1)) / 9
    return jscad.transforms.rotateZ(
      angle,
      box({
        size: [p.bandThickness * 0.8, p.bandThickness * 4, p.bandWidth * 0.55],
        center: [0, outer / 2, 0],
      }),
    )
  })
  return subtract(union(band, housing, screw), ...slots)
}
export function createHoseClampMesh(input: HoseClampModelPropsInput = {}) {
  return geom3ToIndexedMesh(createHoseClampGeom(input))
}
