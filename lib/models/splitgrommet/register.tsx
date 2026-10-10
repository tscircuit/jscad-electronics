import { splitGrommetModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { SplitGrommet } from "./SplitGrommet"
export const model = defineModelRenderer({
  name: "splitgrommet",
  schema: splitGrommetModelDefinitionSchema,
  render: ({ fn, ...props }) => <SplitGrommet {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
