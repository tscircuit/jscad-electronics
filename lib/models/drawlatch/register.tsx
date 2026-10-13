import { drawLatchModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { DrawLatch } from "./DrawLatch"
export const model = defineModelRenderer({
  name: "drawlatch",
  schema: drawLatchModelDefinitionSchema,
  render: ({ fn, ...props }) => <DrawLatch {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
