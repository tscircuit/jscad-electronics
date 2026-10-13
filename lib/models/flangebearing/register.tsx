import { flangeBearingModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { FlangeBearing } from "./FlangeBearing"
export const model = defineModelRenderer({
  name: "flangebearing",
  schema: flangeBearingModelDefinitionSchema,
  render: ({ fn, ...props }) => <FlangeBearing {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
