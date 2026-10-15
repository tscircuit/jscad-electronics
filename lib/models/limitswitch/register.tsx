import { limitSwitchModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { LimitSwitch } from "./LimitSwitch"
export const model = defineModelRenderer({
  name: "limitswitch",
  schema: limitSwitchModelDefinitionSchema,
  render: ({ fn, ...props }) => <LimitSwitch {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
