import { universalJointModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { UniversalJoint } from "./UniversalJoint"
export const model = defineModelRenderer({
  name: "universaljoint",
  schema: universalJointModelDefinitionSchema,
  render: ({ fn, ...props }) => <UniversalJoint {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
