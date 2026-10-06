import { buttonScrewModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { ButtonScrew } from "./ButtonScrew"

export const model = defineModelRenderer({
  name: "buttonscrew",
  schema: buttonScrewModelDefinitionSchema,
  render: ({ fn, ...props }) => <ButtonScrew {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
