import { airLubricatorModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { AirLubricator } from "./AirLubricator"
export const model = defineModelRenderer({
  name: "airlubricator",
  schema: airLubricatorModelDefinitionSchema,
  render: ({ fn, ...props }) => <AirLubricator {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
