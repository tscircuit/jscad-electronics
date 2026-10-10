import { pcbRailModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PcbRail } from "./PcbRail"
export const model = defineModelRenderer({
  name: "pcbrail",
  schema: pcbRailModelDefinitionSchema,
  render: ({ fn, ...props }) => <PcbRail {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
