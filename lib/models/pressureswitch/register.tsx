import { pressureSwitchModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PressureSwitch } from "./PressureSwitch"
export const model = defineModelRenderer({
  name: "pressureswitch",
  schema: pressureSwitchModelDefinitionSchema,
  render: ({ fn, ...props }) => <PressureSwitch {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
