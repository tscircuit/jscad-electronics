import { solidRivetModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { SolidRivet } from "./SolidRivet"
export const model = defineModelRenderer({
  name: "solidrivet",
  schema: solidRivetModelDefinitionSchema,
  render: ({ fn, ...props }) => <SolidRivet {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
