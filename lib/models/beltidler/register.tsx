import { beltIdlerModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { BeltIdler } from "./BeltIdler"
export const model = defineModelRenderer({
  name: "beltidler",
  schema: beltIdlerModelDefinitionSchema,
  render: ({ fn, ...props }) => <BeltIdler {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
