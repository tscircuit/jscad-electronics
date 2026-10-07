import { tSlotInsideCornerModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { TSlotInsideCorner } from "./TSlotInsideCorner"

export const model = defineModelRenderer({
  name: "tslotinsidecorner",
  schema: tSlotInsideCornerModelDefinitionSchema,
  render: ({ fn, ...props }) => <TSlotInsideCorner {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
