import { stepBlockModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { StepBlock } from "./StepBlock"
export const model = defineModelRenderer({
  name: "stepblock",
  schema: stepBlockModelDefinitionSchema,
  render: ({ fn, ...props }) => <StepBlock {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
