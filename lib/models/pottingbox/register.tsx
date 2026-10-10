import { pottingBoxModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PottingBox } from "./PottingBox"
export const model = defineModelRenderer({
  name: "pottingbox",
  schema: pottingBoxModelDefinitionSchema,
  render: ({ fn, ...props }) => <PottingBox {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
