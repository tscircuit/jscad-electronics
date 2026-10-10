import { tSlotCoverStripModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { TSlotCoverStrip } from "./TSlotCoverStrip"
export const model = defineModelRenderer({
  name: "tslotcoverstrip",
  schema: tSlotCoverStripModelDefinitionSchema,
  render: ({ fn, ...props }) => <TSlotCoverStrip {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
