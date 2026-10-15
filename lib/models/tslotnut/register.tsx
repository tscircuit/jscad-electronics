import { tSlotNutModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { TSlotNut } from "./TSlotNut"
export const model = defineModelRenderer({
  name: "tslotnut",
  schema: tSlotNutModelDefinitionSchema,
  render: ({ fn, ...props }) => <TSlotNut {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
