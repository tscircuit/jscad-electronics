import { pressureGaugeModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PressureGauge } from "./PressureGauge"
export const model = defineModelRenderer({
  name: "pressuregauge",
  schema: pressureGaugeModelDefinitionSchema,
  render: ({ fn, ...props }) => <PressureGauge {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
