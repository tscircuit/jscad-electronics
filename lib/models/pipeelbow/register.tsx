import { pipeElbowModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PipeElbow } from "./PipeElbow"
export const model = defineModelRenderer({
  name: "pipeelbow",
  schema: pipeElbowModelDefinitionSchema,
  render: ({ fn, ...props }) => <PipeElbow {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
