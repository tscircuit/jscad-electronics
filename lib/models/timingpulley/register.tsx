import { timingPulleyModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { TimingPulley } from "./TimingPulley"
export const model = defineModelRenderer({
  name: "timingpulley",
  schema: timingPulleyModelDefinitionSchema,
  render: ({ fn, ...props }) => <TimingPulley {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
