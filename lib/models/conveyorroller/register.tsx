import { conveyorRollerModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { ConveyorRoller } from "./ConveyorRoller"
export const model = defineModelRenderer({
  name: "conveyorroller",
  schema: conveyorRollerModelDefinitionSchema,
  render: ({ fn, ...props }) => <ConveyorRoller {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
