import { reducingBushingModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { ReducingBushing } from "./ReducingBushing"
export const model = defineModelRenderer({
  name: "reducingbushing",
  schema: reducingBushingModelDefinitionSchema,
  render: ({ fn, ...props }) => <ReducingBushing {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
