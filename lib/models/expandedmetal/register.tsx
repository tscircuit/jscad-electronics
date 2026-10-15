import { expandedMetalModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { ExpandedMetal } from "./ExpandedMetal"
export const model = defineModelRenderer({
  name: "expandedmetal",
  schema: expandedMetalModelDefinitionSchema,
  render: ({ fn, ...props }) => <ExpandedMetal {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
