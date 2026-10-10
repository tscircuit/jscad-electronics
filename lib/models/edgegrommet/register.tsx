import { edgeGrommetModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { EdgeGrommet } from "./EdgeGrommet"
export const model = defineModelRenderer({
  name: "edgegrommet",
  schema: edgeGrommetModelDefinitionSchema,
  render: ({ fn, ...props }) => <EdgeGrommet {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
