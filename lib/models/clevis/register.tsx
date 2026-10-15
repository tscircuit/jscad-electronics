import { clevisModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { Clevis } from "./Clevis"
export const model = defineModelRenderer({
  name: "clevis",
  schema: clevisModelDefinitionSchema,
  render: ({ fn, ...props }) => <Clevis {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
