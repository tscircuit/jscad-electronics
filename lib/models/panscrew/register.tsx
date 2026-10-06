import { panScrewModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PanScrew } from "./PanScrew"

export const model = defineModelRenderer({
  name: "panscrew",
  schema: panScrewModelDefinitionSchema,
  render: ({ fn, ...props }) => <PanScrew {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
