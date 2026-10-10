import { zeeBarModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { ZeeBar } from "./ZeeBar"
export const model = defineModelRenderer({
  name: "zeebar",
  schema: zeeBarModelDefinitionSchema,
  render: ({ fn, ...props }) => <ZeeBar {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
