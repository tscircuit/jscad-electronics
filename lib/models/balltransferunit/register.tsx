import { ballTransferUnitModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { BallTransferUnit } from "./BallTransferUnit"

export const model = defineModelRenderer({
  name: "balltransferunit",
  schema: ballTransferUnitModelDefinitionSchema,
  render: ({ fn, ...props }) => <BallTransferUnit {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
