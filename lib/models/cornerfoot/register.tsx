import { cornerFootModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { CornerFoot } from "./CornerFoot"
export const model = defineModelRenderer({
  name: "cornerfoot",
  schema: cornerFootModelDefinitionSchema,
  render: ({ fn, ...props }) => <CornerFoot {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
