import { spacerModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { Spacer } from "./Spacer"

export const model = defineModelRenderer({
  name: "spacer",
  schema: spacerModelDefinitionSchema,
  render: ({ fn, ...props }) => <Spacer {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
