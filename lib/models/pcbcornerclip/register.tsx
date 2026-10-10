import { pcbCornerClipModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PcbCornerClip } from "./PcbCornerClip"
export const model = defineModelRenderer({
  name: "pcbcornerclip",
  schema: pcbCornerClipModelDefinitionSchema,
  render: ({ fn, ...props }) => <PcbCornerClip {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
