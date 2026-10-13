import { cylindricalRollerBearingModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { CylindricalRollerBearing } from "./CylindricalRollerBearing"
export const model = defineModelRenderer({
  name: "cylindricalrollerbearing",
  schema: cylindricalRollerBearingModelDefinitionSchema,
  render: ({ fn, ...props }) => <CylindricalRollerBearing {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
