import { flangeboltModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { FlangeBolt } from "./FlangeBolt"
export const model = defineModelRenderer({
  name: "flangebolt",
  schema: flangeboltModelDefinitionSchema,
  render: ({ fn, ...props }) => <FlangeBolt {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
