import { camFollowerModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { CamFollower } from "./CamFollower"
export const model = defineModelRenderer({
  name: "camfollower",
  schema: camFollowerModelDefinitionSchema,
  render: ({ fn, ...props }) => <CamFollower {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
