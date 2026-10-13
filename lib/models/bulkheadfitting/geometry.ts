import jscad from "@jscad/modeling"
import {
  bulkheadFittingModelPropsSchema,
  type BulkheadFittingModelPropsInput,
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
export function createBulkheadFittingGeom(
  input: BulkheadFittingModelPropsInput = {},
) {
  const p = bulkheadFittingModelPropsSchema.parse(input)
  const e = overrun(Math.max(...Object.values(p)))
  const flangeX = -p.panelGap / 2 - p.flangeThickness / 2
  const nutX = p.panelGap / 2 + p.nutThickness / 2
  return subtract(
    union(
      solidX(p.outerDiameter, p.length),
      solidX(p.flangeDiameter, p.flangeThickness, flangeX),
      hexX(p.nutAcrossFlats, p.nutThickness, nutX),
    ),
    solidX(p.boreDiameter, p.length + e),
  )
}
export function createBulkheadFittingMesh(
  input: BulkheadFittingModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createBulkheadFittingGeom(input))
}
