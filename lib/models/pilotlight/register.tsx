import { pilotLightModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PilotLight } from "./PilotLight"
export const model = defineModelRenderer({
  name: "pilotlight",
  schema: pilotLightModelDefinitionSchema,
  render: ({ fn, ...props }) => <PilotLight {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
