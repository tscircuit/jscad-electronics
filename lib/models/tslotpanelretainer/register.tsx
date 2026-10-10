import { tSlotPanelRetainerModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { TSlotPanelRetainer } from "./TSlotPanelRetainer"
export const model = defineModelRenderer({
  name: "tslotpanelretainer",
  schema: tSlotPanelRetainerModelDefinitionSchema,
  render: ({ fn, ...props }) => <TSlotPanelRetainer {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
