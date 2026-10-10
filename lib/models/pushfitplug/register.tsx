import { pushFitPlugModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PushFitPlug } from "./PushFitPlug"
export const model = defineModelRenderer({
  name: "pushfitplug",
  schema: pushFitPlugModelDefinitionSchema,
  render: ({ fn, ...props }) => <PushFitPlug {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
