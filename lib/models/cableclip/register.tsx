import { cableClipModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { CableClip } from "./CableClip"
export const model = defineModelRenderer({
  name: "cableclip",
  schema: cableClipModelDefinitionSchema,
  render: ({ fn, ...props }) => <CableClip {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
