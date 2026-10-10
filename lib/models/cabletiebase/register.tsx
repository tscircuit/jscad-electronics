import { cableTieBaseModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { CableTieBase } from "./CableTieBase"
export const model = defineModelRenderer({
  name: "cabletiebase",
  schema: cableTieBaseModelDefinitionSchema,
  render: ({ fn, ...props }) => <CableTieBase {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
