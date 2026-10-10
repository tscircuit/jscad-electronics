import { cableClampModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { CableClamp } from "./CableClamp"
export const model = defineModelRenderer({
  name: "cableclamp",
  schema: cableClampModelDefinitionSchema,
  render: ({ fn, ...props }) => <CableClamp {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
