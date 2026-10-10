import { rectangularGasketModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { RectangularGasket } from "./RectangularGasket"
export const model = defineModelRenderer({
  name: "rectangulargasket",
  schema: rectangularGasketModelDefinitionSchema,
  render: ({ fn, ...props }) => <RectangularGasket {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
