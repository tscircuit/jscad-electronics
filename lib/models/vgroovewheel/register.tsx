import { vGrooveWheelModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { VGrooveWheel } from "./VGrooveWheel"
export const model = defineModelRenderer({
  name: "vgroovewheel",
  schema: vGrooveWheelModelDefinitionSchema,
  render: ({ fn, ...props }) => <VGrooveWheel {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
