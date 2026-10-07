import { linearBallBearingModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { LinearBallBearing } from "./LinearBallBearing"

export const model = defineModelRenderer({
  name: "linearballbearing",
  schema: linearBallBearingModelDefinitionSchema,
  render: ({ fn, ...props }) => <LinearBallBearing {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
