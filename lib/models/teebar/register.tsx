import { teeBarModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { TeeBar } from "./TeeBar"
export const model = defineModelRenderer({
  name: "teebar",
  schema: teeBarModelDefinitionSchema,
  render: ({ fn, ...props }) => <TeeBar {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
