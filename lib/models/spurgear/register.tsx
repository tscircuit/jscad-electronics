import { spurGearModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { SpurGear } from "../../SpurGear"

export const model = defineModelRenderer({
  name: "spurgear",
  schema: spurGearModelDefinitionSchema,
  render: ({ fn, ...props }) => <SpurGear {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
