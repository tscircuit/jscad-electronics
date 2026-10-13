import { airRegulatorModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { AirRegulator } from "./AirRegulator"
export const model = defineModelRenderer({
  name: "airregulator",
  schema: airRegulatorModelDefinitionSchema,
  render: ({ fn, ...props }) => <AirRegulator {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
