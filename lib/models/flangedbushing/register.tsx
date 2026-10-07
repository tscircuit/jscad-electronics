import { flangedBushingModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { FlangedBushing } from "./FlangedBushing"

export const model = defineModelRenderer({
  name: "flangedbushing",
  schema: flangedBushingModelDefinitionSchema,
  render: ({ fn, ...props }) => <FlangedBushing {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
