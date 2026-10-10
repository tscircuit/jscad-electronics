import { hexShaftModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { HexShaft } from "./HexShaft"
export const model = defineModelRenderer({
  name: "hexshaft",
  schema: hexShaftModelDefinitionSchema,
  render: ({ fn, ...props }) => <HexShaft {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
