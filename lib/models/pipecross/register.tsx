import { pipeCrossModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PipeCross } from "./PipeCross"
export const model = defineModelRenderer({
  name: "pipecross",
  schema: pipeCrossModelDefinitionSchema,
  render: ({ fn, ...props }) => <PipeCross {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
