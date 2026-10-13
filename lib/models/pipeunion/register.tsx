import { pipeUnionModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PipeUnion } from "./PipeUnion"
export const model = defineModelRenderer({
  name: "pipeunion",
  schema: pipeUnionModelDefinitionSchema,
  render: ({ fn, ...props }) => <PipeUnion {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
