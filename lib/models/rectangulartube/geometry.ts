import type jscad from "@jscad/modeling"
import type { RectangularTubeModelPropsInput } from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
import { createRectangularTubeModel } from "./model"

/** Open rectangular stock tube, defined by its normal Fiber construction nodes.
 * Section centered on XY, ends Z=0 and Z=length.
 */
export function createRectangularTubeGeom(
  input: RectangularTubeModelPropsInput,
) {
  const model = createRectangularTubeModel(input)
  // The model convenience validates that the component rendered one Geom3.
  return model.geometries[0] as jscad.geometries.geom3.Geom3
}

export function createRectangularTubeMesh(
  input: RectangularTubeModelPropsInput,
) {
  return geom3ToIndexedMesh(createRectangularTubeGeom(input))
}
