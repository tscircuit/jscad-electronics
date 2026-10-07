import { hollowPositioningArmTubeModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { HollowPositioningArmTube } from "./HollowPositioningArmTube"

export const model = defineModelRenderer({
  name: "hollowpositioningarmtube",
  schema: hollowPositioningArmTubeModelDefinitionSchema,
  render: ({ fn, ...props }) => <HollowPositioningArmTube {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
