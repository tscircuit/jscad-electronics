import { hoseBarbModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { HoseBarb } from "./HoseBarb"
export const model = defineModelRenderer({
  name: "hosebarb",
  schema: hoseBarbModelDefinitionSchema,
  render: ({ fn, ...props }) => <HoseBarb {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
