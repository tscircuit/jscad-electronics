import { nemaMotorModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { NemaMotor } from "../../NemaMotor"

export const model = defineModelRenderer({
  name: "nema",
  schema: nemaMotorModelDefinitionSchema,
  render: ({ fn, ...props }) => <NemaMotor {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
