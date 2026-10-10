import { hollowShaftModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { HollowShaft } from "./HollowShaft"
export const model = defineModelRenderer({
  name: "hollowshaft",
  schema: hollowShaftModelDefinitionSchema,
  render: ({ fn, ...props }) => <HollowShaft {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
