import { cylinderMountModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { CylinderMount } from "./CylinderMount"
export const model = defineModelRenderer({
  name: "cylindermount",
  schema: cylinderMountModelDefinitionSchema,
  render: ({ fn, ...props }) => <CylinderMount {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
