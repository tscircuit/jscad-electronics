import { ballValveModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { BallValve } from "./BallValve"
export const model = defineModelRenderer({
  name: "ballvalve",
  schema: ballValveModelDefinitionSchema,
  render: ({ fn, ...props }) => <BallValve {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
