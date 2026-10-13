import { oldhamCouplingModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { OldhamCoupling } from "./OldhamCoupling"
export const model = defineModelRenderer({
  name: "oldhamcoupling",
  schema: oldhamCouplingModelDefinitionSchema,
  render: ({ fn, ...props }) => <OldhamCoupling {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
