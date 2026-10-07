import { nemaMotorMountModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { NemaMotorMount } from "./NemaMotorMount"

export const model = defineModelRenderer({
  name: "nemamotormount",
  schema: nemaMotorMountModelDefinitionSchema,
  render: ({ fn, ...props }) => <NemaMotorMount {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
