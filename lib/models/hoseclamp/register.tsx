import { hoseClampModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { HoseClamp } from "./HoseClamp"
export const model = defineModelRenderer({
  name: "hoseclamp",
  schema: hoseClampModelDefinitionSchema,
  render: ({ fn, ...props }) => <HoseClamp {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
