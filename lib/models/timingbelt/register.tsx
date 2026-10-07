import { timingBeltModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { TimingBelt } from "./TimingBelt"
export const model = defineModelRenderer({
  name: "timingbelt",
  schema: timingBeltModelDefinitionSchema,
  render: ({ fn, ...props }) => <TimingBelt {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
