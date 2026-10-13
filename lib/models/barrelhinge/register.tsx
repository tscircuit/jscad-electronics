import { barrelHingeModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { BarrelHinge } from "./BarrelHinge"
export const model = defineModelRenderer({
  name: "barrelhinge",
  schema: barrelHingeModelDefinitionSchema,
  render: ({ fn, ...props }) => <BarrelHinge {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
