import { tSlotExtrusionModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { TSlotExtrusion } from "./TSlotExtrusion"

export const model = defineModelRenderer({
  name: "tslotextrusion",
  schema: tSlotExtrusionModelDefinitionSchema,
  render: ({ fn, ...props }) => <TSlotExtrusion {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
