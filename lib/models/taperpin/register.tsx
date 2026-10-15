import { taperPinModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { TaperPin } from "./TaperPin"
export const model = defineModelRenderer({
  name: "taperpin",
  schema: taperPinModelDefinitionSchema,
  render: ({ fn, ...props }) => <TaperPin {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
