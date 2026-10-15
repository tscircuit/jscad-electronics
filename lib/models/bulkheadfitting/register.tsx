import { bulkheadFittingModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { BulkheadFitting } from "./BulkheadFitting"
export const model = defineModelRenderer({
  name: "bulkheadfitting",
  schema: bulkheadFittingModelDefinitionSchema,
  render: ({ fn, ...props }) => <BulkheadFitting {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
