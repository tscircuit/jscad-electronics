import { flatGasketModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { FlatGasket } from "./FlatGasket"
export const model = defineModelRenderer({
  name: "flatgasket",
  schema: flatGasketModelDefinitionSchema,
  render: ({ fn, ...props }) => <FlatGasket {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
