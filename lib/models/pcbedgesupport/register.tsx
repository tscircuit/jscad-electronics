import { pcbEdgeSupportModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PcbEdgeSupport } from "./PcbEdgeSupport"
export const model = defineModelRenderer({
  name: "pcbedgesupport",
  schema: pcbEdgeSupportModelDefinitionSchema,
  render: ({ fn, ...props }) => <PcbEdgeSupport {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
