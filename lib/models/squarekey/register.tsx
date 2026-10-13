import { squareKeyModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { SquareKey } from "./SquareKey"
export const model = defineModelRenderer({
  name: "squarekey",
  schema: squareKeyModelDefinitionSchema,
  render: ({ fn, ...props }) => <SquareKey {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
