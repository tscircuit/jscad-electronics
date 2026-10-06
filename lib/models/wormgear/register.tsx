import { wormGearModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { WormGear } from "../../WormGear"

export const model = defineModelRenderer({
  name: "wormgear",
  schema: wormGearModelDefinitionSchema,
  render: ({ fn, ...props }) => <WormGear {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
