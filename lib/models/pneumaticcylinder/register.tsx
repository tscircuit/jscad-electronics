import { pneumaticCylinderModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PneumaticCylinder } from "./PneumaticCylinder"
export const model = defineModelRenderer({
  name: "pneumaticcylinder",
  schema: pneumaticCylinderModelDefinitionSchema,
  render: ({ fn, ...props }) => <PneumaticCylinder {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
