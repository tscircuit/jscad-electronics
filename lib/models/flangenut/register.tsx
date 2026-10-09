import { flangeNutModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { FlangeNut } from "./FlangeNut"

export const model = defineModelRenderer({
  name: "flangenut",
  schema: flangeNutModelDefinitionSchema,
  render: ({ fn, ...props }) => <FlangeNut {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
