import { pipeNippleModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PipeNipple } from "./PipeNipple"
export const model = defineModelRenderer({
  name: "pipenipple",
  schema: pipeNippleModelDefinitionSchema,
  render: ({ fn, ...props }) => <PipeNipple {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
