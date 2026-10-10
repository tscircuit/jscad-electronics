import { angleBarModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { AngleBar } from "./AngleBar"
export const model = defineModelRenderer({
  name: "anglebar",
  schema: angleBarModelDefinitionSchema,
  render: ({ fn, ...props }) => <AngleBar {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
