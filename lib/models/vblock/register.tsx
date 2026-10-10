import { vBlockModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { VBlock } from "./VBlock"
export const model = defineModelRenderer({
  name: "vblock",
  schema: vBlockModelDefinitionSchema,
  render: ({ fn, ...props }) => <VBlock {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
