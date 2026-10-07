import { linearRailModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { LinearRail } from "./LinearRail"
export const model = defineModelRenderer({
  name: "linearrail",
  schema: linearRailModelDefinitionSchema,
  render: ({ fn, ...props }) => <LinearRail {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
