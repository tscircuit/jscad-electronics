import { tSlotEndCapModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { TSlotEndCap } from "./TSlotEndCap"
export const model = defineModelRenderer({
  name: "tslotendcap",
  schema: tSlotEndCapModelDefinitionSchema,
  render: ({ fn, ...props }) => <TSlotEndCap {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
