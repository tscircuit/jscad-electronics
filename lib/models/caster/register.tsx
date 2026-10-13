import { casterModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { Caster } from "./Caster"
export const model = defineModelRenderer({
  name: "caster",
  schema: casterModelDefinitionSchema,
  render: ({ fn, ...props }) => <Caster {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
