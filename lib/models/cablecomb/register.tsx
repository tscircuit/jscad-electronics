import { cableCombModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { CableComb } from "./CableComb"
export const model = defineModelRenderer({
  name: "cablecomb",
  schema: cableCombModelDefinitionSchema,
  render: ({ fn, ...props }) => <CableComb {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
