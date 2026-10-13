import { bellevilleWasherModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { BellevilleWasher } from "./BellevilleWasher"
export const model = defineModelRenderer({
  name: "bellevillewasher",
  schema: bellevilleWasherModelDefinitionSchema,
  render: ({ fn, ...props }) => <BellevilleWasher {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
