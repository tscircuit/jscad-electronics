import { plainBushingModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PlainBushing } from "./PlainBushing"

export const model = defineModelRenderer({
  name: "plainbushing",
  schema: plainBushingModelDefinitionSchema,
  render: ({ fn, ...props }) => <PlainBushing {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
