import { flatHeadScrewModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { FlatHeadScrew } from "./FlatHeadScrew"

export const model = defineModelRenderer({
  name: "flatheadscrew",
  schema: flatHeadScrewModelDefinitionSchema,
  render: ({ fn, ...props }) => <FlatHeadScrew {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
