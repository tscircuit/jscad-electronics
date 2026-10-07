import { gooseneckModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { Gooseneck } from "./Gooseneck"

export const model = defineModelRenderer({
  name: "gooseneck",
  schema: gooseneckModelDefinitionSchema,
  render: ({ fn, ...props }) => <Gooseneck {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
