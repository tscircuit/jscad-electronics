import { dinRailModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { DinRail } from "./DinRail"
export const model = defineModelRenderer({
  name: "dinrail",
  schema: dinRailModelDefinitionSchema,
  render: ({ fn, ...props }) => <DinRail {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
