import { blindRivetModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { BlindRivet } from "./BlindRivet"
export const model = defineModelRenderer({
  name: "blindrivet",
  schema: blindRivetModelDefinitionSchema,
  render: ({ fn, ...props }) => <BlindRivet {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
