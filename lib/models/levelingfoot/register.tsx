import { levelingFootModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { LevelingFoot } from "./LevelingFoot"
export const model = defineModelRenderer({
  name: "levelingfoot",
  schema: levelingFootModelDefinitionSchema,
  render: ({ fn, ...props }) => <LevelingFoot {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
