import { pushbuttonOperatorModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PushbuttonOperator } from "./PushbuttonOperator"
export const model = defineModelRenderer({
  name: "pushbuttonoperator",
  schema: pushbuttonOperatorModelDefinitionSchema,
  render: ({ fn, ...props }) => <PushbuttonOperator {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
