import { ballBearingModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { BallBearing } from "./BallBearing"

export const model = defineModelRenderer({
  name: "ballbearing",
  schema: ballBearingModelDefinitionSchema,
  render: ({ fn, ...props }) => <BallBearing {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
