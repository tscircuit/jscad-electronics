import { nylonLockNutModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { NylonLockNut } from "./NylonLockNut"

export const model = defineModelRenderer({
  name: "nylonlocknut",
  schema: nylonLockNutModelDefinitionSchema,
  render: ({ fn, ...props }) => <NylonLockNut {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
