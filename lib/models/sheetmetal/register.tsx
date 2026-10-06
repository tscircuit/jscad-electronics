import { sheetMetalModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { SheetMetal } from "../../SheetMetal"

export const model = defineModelRenderer({
  name: "sheetmetal",
  schema: sheetMetalModelDefinitionSchema,
  render: ({ fn, ...props }) => <SheetMetal {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
