import { adhesiveMountElectricalComponentHeatsinkModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { AdhesiveMountElectricalComponentHeatsink } from "./AdhesiveMountElectricalComponentHeatsink"
export const model = defineModelRenderer({
  name: "adhesivemountelectricalcomponentheatsink",
  schema: adhesiveMountElectricalComponentHeatsinkModelDefinitionSchema,
  render: ({ fn, ...props }) => (
    <AdhesiveMountElectricalComponentHeatsink {...props} />
  ),
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
