import { clevisPinModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { ClevisPin } from "./ClevisPin"
export const model = defineModelRenderer({
  name: "clevispin",
  schema: clevisPinModelDefinitionSchema,
  render: ({ fn, ...props }) => <ClevisPin {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
