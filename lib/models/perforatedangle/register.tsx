import { perforatedAngleModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PerforatedAngle } from "./PerforatedAngle"
export const model = defineModelRenderer({
  name: "perforatedangle",
  schema: perforatedAngleModelDefinitionSchema,
  render: ({ fn, ...props }) => <PerforatedAngle {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
