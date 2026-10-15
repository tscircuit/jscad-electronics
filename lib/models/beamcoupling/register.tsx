import { beamCouplingModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { BeamCoupling } from "./BeamCoupling"
export const model = defineModelRenderer({
  name: "beamcoupling",
  schema: beamCouplingModelDefinitionSchema,
  render: ({ fn, ...props }) => <BeamCoupling {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
