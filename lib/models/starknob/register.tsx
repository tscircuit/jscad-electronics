import { starKnobModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { StarKnob } from "./StarKnob"
export const model = defineModelRenderer({
  name: "starknob",
  schema: starKnobModelDefinitionSchema,
  render: ({ fn, ...props }) => <StarKnob {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
