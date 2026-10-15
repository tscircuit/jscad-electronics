import { emergencyStopSwitchModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { EmergencyStopSwitch } from "./EmergencyStopSwitch"
export const model = defineModelRenderer({
  name: "emergencystopswitch",
  schema: emergencyStopSwitchModelDefinitionSchema,
  render: ({ fn, ...props }) => <EmergencyStopSwitch {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
