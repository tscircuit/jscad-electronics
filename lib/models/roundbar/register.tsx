import { roundBarModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { RoundBar } from "./RoundBar"
export const model = defineModelRenderer({
  name: "roundbar",
  schema: roundBarModelDefinitionSchema,
  render: ({ fn, ...props }) => <RoundBar {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
