import { wireDuctModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { WireDuct } from "./WireDuct"
export const model = defineModelRenderer({
  name: "wireduct",
  schema: wireDuctModelDefinitionSchema,
  render: ({ fn, ...props }) => <WireDuct {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
