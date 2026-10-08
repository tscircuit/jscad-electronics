import { torsionSpringModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { TorsionSpring } from "./TorsionSpring"
export const model = defineModelRenderer({
  name: "torsionspring",
  schema: torsionSpringModelDefinitionSchema,
  render: ({ fn, ...props }) => <TorsionSpring {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
