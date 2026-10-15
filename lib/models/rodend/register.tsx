import { rodEndModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { RodEnd } from "./RodEnd"
export const model = defineModelRenderer({
  name: "rodend",
  schema: rodEndModelDefinitionSchema,
  render: ({ fn, ...props }) => <RodEnd {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
