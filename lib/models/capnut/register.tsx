import { capNutModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { CapNut } from "./CapNut"
export const model = defineModelRenderer({
  name: "capnut",
  schema: capNutModelDefinitionSchema,
  render: ({ fn, ...props }) => <CapNut {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
