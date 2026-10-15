import { woodruffKeyModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { WoodruffKey } from "./WoodruffKey"
export const model = defineModelRenderer({
  name: "woodruffkey",
  schema: woodruffKeyModelDefinitionSchema,
  render: ({ fn, ...props }) => <WoodruffKey {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
