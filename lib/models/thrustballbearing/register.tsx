import { thrustBallBearingModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { ThrustBallBearing } from "./ThrustBallBearing"

export const model = defineModelRenderer({
  name: "thrustballbearing",
  schema: thrustBallBearingModelDefinitionSchema,
  render: ({ fn, ...props }) => <ThrustBallBearing {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
