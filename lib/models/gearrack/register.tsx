import { gearRackModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { GearRack } from "./GearRack"
export const model = defineModelRenderer({
  name: "gearrack",
  schema: gearRackModelDefinitionSchema,
  render: ({ fn, ...props }) => <GearRack {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
