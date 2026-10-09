import { dowelPinModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { DowelPin } from "./DowelPin"
export const model = defineModelRenderer({
  name: "dowelpin",
  schema: dowelPinModelDefinitionSchema,
  render: ({ fn, ...props }) => <DowelPin {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
