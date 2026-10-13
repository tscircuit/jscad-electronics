import { compressionFittingModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { CompressionFitting } from "./CompressionFitting"
export const model = defineModelRenderer({
  name: "compressionfitting",
  schema: compressionFittingModelDefinitionSchema,
  render: ({ fn, ...props }) => <CompressionFitting {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
