import { heatSetInsertModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { HeatSetInsert } from "./HeatSetInsert"
export const model = defineModelRenderer({
  name: "heatsetinsert",
  schema: heatSetInsertModelDefinitionSchema,
  render: ({ fn, ...props }) => <HeatSetInsert {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
