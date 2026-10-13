import { handwheelModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { Handwheel } from "./Handwheel"
export const model = defineModelRenderer({
  name: "handwheel",
  schema: handwheelModelDefinitionSchema,
  render: ({ fn, ...props }) => <Handwheel {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
