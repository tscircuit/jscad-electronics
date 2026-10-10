import { perforatedSheetModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PerforatedSheet } from "./PerforatedSheet"
export const model = defineModelRenderer({
  name: "perforatedsheet",
  schema: perforatedSheetModelDefinitionSchema,
  render: ({ fn, ...props }) => <PerforatedSheet {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
