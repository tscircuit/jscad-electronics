import { needleValveModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { NeedleValve } from "./NeedleValve"
export const model = defineModelRenderer({
  name: "needlevalve",
  schema: needleValveModelDefinitionSchema,
  render: ({ fn, ...props }) => <NeedleValve {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
