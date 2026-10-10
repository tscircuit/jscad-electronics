import { sandwichMountModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { SandwichMount } from "./SandwichMount"
export const model = defineModelRenderer({
  name: "sandwichmount",
  schema: sandwichMountModelDefinitionSchema,
  render: ({ fn, ...props }) => <SandwichMount {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
