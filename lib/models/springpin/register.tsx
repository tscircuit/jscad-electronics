import { springPinModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { SpringPin } from "./SpringPin"
export const model = defineModelRenderer({
  name: "springpin",
  schema: springPinModelDefinitionSchema,
  render: ({ fn, ...props }) => <SpringPin {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
