import { setscrewModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { SetScrew } from "./SetScrew"
export const model = defineModelRenderer({
  name: "setscrew",
  schema: setscrewModelDefinitionSchema,
  render: ({ fn, ...props }) => <SetScrew {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
