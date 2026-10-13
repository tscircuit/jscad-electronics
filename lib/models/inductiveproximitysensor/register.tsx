import { inductiveProximitySensorModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { InductiveProximitySensor } from "./InductiveProximitySensor"
export const model = defineModelRenderer({
  name: "inductiveproximitysensor",
  schema: inductiveProximitySensorModelDefinitionSchema,
  render: ({ fn, ...props }) => <InductiveProximitySensor {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
