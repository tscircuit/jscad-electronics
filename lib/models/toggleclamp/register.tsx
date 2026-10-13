import { toggleClampModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { ToggleClamp } from "./ToggleClamp"
export const model = defineModelRenderer({
  name: "toggleclamp",
  schema: toggleClampModelDefinitionSchema,
  render: ({ fn, ...props }) => <ToggleClamp {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
