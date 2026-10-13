import { rubberBumperModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { RubberBumper } from "./RubberBumper"
export const model = defineModelRenderer({
  name: "rubberbumper",
  schema: rubberBumperModelDefinitionSchema,
  render: ({ fn, ...props }) => <RubberBumper {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
