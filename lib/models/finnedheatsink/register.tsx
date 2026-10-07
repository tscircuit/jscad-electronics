import { finnedHeatsinkModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { FinnedHeatsink } from "./FinnedHeatsink"
export const model = defineModelRenderer({
  name: "finnedheatsink",
  schema: finnedHeatsinkModelDefinitionSchema,
  render: ({ fn, ...props }) => <FinnedHeatsink {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
