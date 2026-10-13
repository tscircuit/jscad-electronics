import { airFilterModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { AirFilter } from "./AirFilter"
export const model = defineModelRenderer({
  name: "airfilter",
  schema: airFilterModelDefinitionSchema,
  render: ({ fn, ...props }) => <AirFilter {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
