import { retainingRingModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { RetainingRing } from "./RetainingRing"
export const model = defineModelRenderer({
  name: "retainingring",
  schema: retainingRingModelDefinitionSchema,
  render: ({ fn, ...props }) => <RetainingRing {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
