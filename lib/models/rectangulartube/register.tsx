import { rectangularTubeModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { RectangularTube } from "./RectangularTube"
export const model = defineModelRenderer({
  name: "rectangulartube",
  schema: rectangularTubeModelDefinitionSchema,
  render: ({ fn, ...props }) => <RectangularTube {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
