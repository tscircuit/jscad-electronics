import { manifoldModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { Manifold } from "./Manifold"
export const model = defineModelRenderer({
  name: "manifold",
  schema: manifoldModelDefinitionSchema,
  render: ({ fn, ...props }) => <Manifold {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
