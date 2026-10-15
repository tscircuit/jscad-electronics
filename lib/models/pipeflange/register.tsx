import { pipeFlangeModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PipeFlange } from "./PipeFlange"
export const model = defineModelRenderer({
  name: "pipeflange",
  schema: pipeFlangeModelDefinitionSchema,
  render: ({ fn, ...props }) => <PipeFlange {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
