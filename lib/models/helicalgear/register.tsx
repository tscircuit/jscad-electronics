import { helicalGearModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { HelicalGear } from "../../HelicalGear"

export const model = defineModelRenderer({
  name: "helicalgear",
  schema: helicalGearModelDefinitionSchema,
  render: ({ fn, ...props }) => <HelicalGear {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
