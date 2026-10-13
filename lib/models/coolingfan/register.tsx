import { coolingFanModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { CoolingFan } from "./CoolingFan"
export const model = defineModelRenderer({
  name: "coolingfan",
  schema: coolingFanModelDefinitionSchema,
  render: ({ fn, ...props }) => <CoolingFan {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
