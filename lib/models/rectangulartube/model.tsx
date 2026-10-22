import jscad from "@jscad/modeling"
import type { RectangularTubeModelPropsInput } from "@tscircuit/modelprinter"
import { renderToJscadModel } from "jscad-fiber/model"
import { RectangularTube } from "./RectangularTube"

/** Convenience for rendering the same Fiber component used by the model
 * registry. Its declared named features are collected by the Fiber renderer.
 */
export function createRectangularTubeModel(
  input: RectangularTubeModelPropsInput,
) {
  const model = renderToJscadModel(<RectangularTube {...input} />, jscad)
  if (
    model.geometries.length !== 1 ||
    !jscad.geometries.geom3.isA(model.geometries[0])
  )
    throw new Error("RectangularTube must render exactly one native solid")
  return model
}
