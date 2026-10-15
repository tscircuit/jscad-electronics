import { hairpinCotterModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { HairpinCotter } from "./HairpinCotter"
export const model = defineModelRenderer({
  name: "hairpincotter",
  schema: hairpinCotterModelDefinitionSchema,
  render: ({ fn, ...props }) => <HairpinCotter {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
