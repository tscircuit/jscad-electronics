import { sprocketModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { Sprocket } from "./Sprocket"
export const model = defineModelRenderer({
  name: "sprocket",
  schema: sprocketModelDefinitionSchema,
  render: ({ fn, ...props }) => <Sprocket {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
