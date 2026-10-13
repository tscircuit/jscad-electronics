import { pillowBlockBearingModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PillowBlockBearing } from "./PillowBlockBearing"
export const model = defineModelRenderer({
  name: "pillowblockbearing",
  schema: pillowBlockBearingModelDefinitionSchema,
  render: ({ fn, ...props }) => <PillowBlockBearing {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
