import { rollerChainModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { RollerChain } from "./RollerChain"
export const model = defineModelRenderer({
  name: "rollerchain",
  schema: rollerChainModelDefinitionSchema,
  render: ({ fn, ...props }) => <RollerChain {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
