import { hexBoltModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { HexBolt } from "./HexBolt"

export const model = defineModelRenderer({
  name: "hexbolt",
  schema: hexBoltModelDefinitionSchema,
  render: ({ fn, ...props }) => <HexBolt {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
