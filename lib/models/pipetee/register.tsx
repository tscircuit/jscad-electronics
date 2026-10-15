import { pipeTeeModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PipeTee } from "./PipeTee"
export const model = defineModelRenderer({
  name: "pipetee",
  schema: pipeTeeModelDefinitionSchema,
  render: ({ fn, ...props }) => <PipeTee {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
