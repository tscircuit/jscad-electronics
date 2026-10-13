import { pushConnectFittingModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PushConnectFitting } from "./PushConnectFitting"
export const model = defineModelRenderer({
  name: "pushconnectfitting",
  schema: pushConnectFittingModelDefinitionSchema,
  render: ({ fn, ...props }) => <PushConnectFitting {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
