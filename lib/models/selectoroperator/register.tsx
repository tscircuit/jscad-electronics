import { selectorOperatorModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { SelectorOperator } from "./SelectorOperator"
export const model = defineModelRenderer({
  name: "selectoroperator",
  schema: selectorOperatorModelDefinitionSchema,
  render: ({ fn, ...props }) => <SelectorOperator {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
