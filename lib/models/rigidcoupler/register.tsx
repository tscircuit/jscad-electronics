import { rigidCouplerModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { RigidCoupler } from "./RigidCoupler"

export const model = defineModelRenderer({
  name: "rigidcoupler",
  schema: rigidCouplerModelDefinitionSchema,
  render: ({ fn, ...props }) => <RigidCoupler {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
