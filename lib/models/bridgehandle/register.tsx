import { bridgeHandleModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { BridgeHandle } from "./BridgeHandle"
export const model = defineModelRenderer({
  name: "bridgehandle",
  schema: bridgeHandleModelDefinitionSchema,
  render: ({ fn, ...props }) => <BridgeHandle {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
