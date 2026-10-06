import { hexNutModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { HexNut } from "./HexNut"

export const model = defineModelRenderer({
  name: "hexnut",
  schema: hexNutModelDefinitionSchema,
  render: ({ fn, ...props }) => <HexNut {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
