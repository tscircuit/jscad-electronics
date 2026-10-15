import { solenoidValveModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { SolenoidValve } from "./SolenoidValve"
export const model = defineModelRenderer({
  name: "solenoidvalve",
  schema: solenoidValveModelDefinitionSchema,
  render: ({ fn, ...props }) => <SolenoidValve {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
