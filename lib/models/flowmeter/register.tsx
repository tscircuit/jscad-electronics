import { flowMeterModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { FlowMeter } from "./FlowMeter"
export const model = defineModelRenderer({
  name: "flowmeter",
  schema: flowMeterModelDefinitionSchema,
  render: ({ fn, ...props }) => <FlowMeter {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
