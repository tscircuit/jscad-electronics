import { flatWasherModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { FlatWasher } from "./FlatWasher"
export const model = defineModelRenderer({
  name: "flatwasher",
  schema: flatWasherModelDefinitionSchema,
  render: ({ fn, ...props }) => <FlatWasher {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
