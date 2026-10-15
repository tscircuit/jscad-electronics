import jscad from "@jscad/modeling"
import {
  compressionFittingModelPropsSchema,
  type CompressionFittingModelPropsInput,
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
export function createCompressionFittingGeom(
  input: CompressionFittingModelPropsInput = {},
) {
  const p = compressionFittingModelPropsSchema.parse(input)
  const e = overrun(Math.max(...Object.values(p)))
  const shell = union(
    solidX(p.outerDiameter, p.length),
    ...[-1, 1].map((side) =>
      hexX(
        p.nutAcrossFlats,
        p.nutLength,
        (side * (p.length - p.nutLength)) / 2,
      ),
    ),
  )
  return subtract(
    shell,
    solidX(p.boreDiameter, p.length + e),
    ...[-1, 1].map((side) =>
      solidX(
        p.tubeDiameter,
        p.nutLength + e,
        (side * (p.length - p.nutLength)) / 2,
      ),
    ),
  )
}
export function createCompressionFittingMesh(
  input: CompressionFittingModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createCompressionFittingGeom(input))
}
