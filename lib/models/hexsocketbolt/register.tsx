import { hexSocketBoltModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { HexSocketBolt } from "../../HexSocketBolt"

export const model = defineModelRenderer({
  name: "hexsocketbolt",
  schema: hexSocketBoltModelDefinitionSchema,
  render: ({ fn, ...props }) => <HexSocketBolt {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
