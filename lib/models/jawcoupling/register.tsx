import { jawCouplingModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { JawCoupling } from "./JawCoupling"
export const model = defineModelRenderer({
  name: "jawcoupling",
  schema: jawCouplingModelDefinitionSchema,
  render: ({ fn, ...props }) => <JawCoupling {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
