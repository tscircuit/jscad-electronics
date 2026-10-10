import { keyedShaftModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { KeyedShaft } from "./KeyedShaft"
export const model = defineModelRenderer({
  name: "keyedshaft",
  schema: keyedShaftModelDefinitionSchema,
  render: ({ fn, ...props }) => <KeyedShaft {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
