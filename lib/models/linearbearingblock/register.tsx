import { linearBearingBlockModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { LinearBearingBlock } from "./LinearBearingBlock"

export const model = defineModelRenderer({
  name: "linearbearingblock",
  schema: linearBearingBlockModelDefinitionSchema,
  render: ({ fn, ...props }) => <LinearBearingBlock {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
