import { splitWasherModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { SplitWasher } from "./SplitWasher"
export const model = defineModelRenderer({
  name: "splitwasher",
  schema: splitWasherModelDefinitionSchema,
  render: ({ fn, ...props }) => <SplitWasher {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
