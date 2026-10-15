import { checkValveModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { CheckValve } from "./CheckValve"
export const model = defineModelRenderer({
  name: "checkvalve",
  schema: checkValveModelDefinitionSchema,
  render: ({ fn, ...props }) => <CheckValve {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
