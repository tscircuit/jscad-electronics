import { couplingNutModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { CouplingNut } from "./CouplingNut"
export const model = defineModelRenderer({
  name: "couplingnut",
  schema: couplingNutModelDefinitionSchema,
  render: ({ fn, ...props }) => <CouplingNut {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
