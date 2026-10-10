import { rectangularBarModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { RectangularBar } from "./RectangularBar"
export const model = defineModelRenderer({
  name: "rectangularbar",
  schema: rectangularBarModelDefinitionSchema,
  render: ({ fn, ...props }) => <RectangularBar {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
