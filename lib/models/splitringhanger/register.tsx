import { splitRingHangerModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { SplitRingHanger } from "./SplitRingHanger"
export const model = defineModelRenderer({
  name: "splitringhanger",
  schema: splitRingHangerModelDefinitionSchema,
  render: ({ fn, ...props }) => <SplitRingHanger {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
