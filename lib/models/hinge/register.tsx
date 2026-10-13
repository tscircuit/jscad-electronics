import { hingeModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { Hinge } from "./Hinge"
export const model = defineModelRenderer({
  name: "hinge",
  schema: hingeModelDefinitionSchema,
  render: ({ fn, ...props }) => <Hinge {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
