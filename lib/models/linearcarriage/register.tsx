import { linearCarriageModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { LinearCarriage } from "./LinearCarriage"
export const model = defineModelRenderer({
  name: "linearcarriage",
  schema: linearCarriageModelDefinitionSchema,
  render: ({ fn, ...props }) => <LinearCarriage {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
