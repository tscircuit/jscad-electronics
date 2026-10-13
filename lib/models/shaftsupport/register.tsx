import { shaftSupportModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { ShaftSupport } from "./ShaftSupport"
export const model = defineModelRenderer({
  name: "shaftsupport",
  schema: shaftSupportModelDefinitionSchema,
  render: ({ fn, ...props }) => <ShaftSupport {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
