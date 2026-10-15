import { detentPinModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { DetentPin } from "./DetentPin"
export const model = defineModelRenderer({
  name: "detentpin",
  schema: detentPinModelDefinitionSchema,
  render: ({ fn, ...props }) => <DetentPin {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
