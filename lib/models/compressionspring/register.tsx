import { compressionSpringModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { CompressionSpring } from "./CompressionSpring"

export const model = defineModelRenderer({
  name: "compressionspring",
  schema: compressionSpringModelDefinitionSchema,
  render: ({ fn, ...props }) => <CompressionSpring {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
