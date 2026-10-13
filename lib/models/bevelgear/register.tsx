import { bevelGearModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { BevelGear } from "./BevelGear"
export const model = defineModelRenderer({
  name: "bevelgear",
  schema: bevelGearModelDefinitionSchema,
  render: ({ fn, ...props }) => <BevelGear {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
