import { pipeCouplingModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PipeCoupling } from "./PipeCoupling"
export const model = defineModelRenderer({
  name: "pipecoupling",
  schema: pipeCouplingModelDefinitionSchema,
  render: ({ fn, ...props }) => <PipeCoupling {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
