import { flatCableClipModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { FlatCableClip } from "./FlatCableClip"
export const model = defineModelRenderer({
  name: "flatcableclip",
  schema: flatCableClipModelDefinitionSchema,
  render: ({ fn, ...props }) => <FlatCableClip {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
