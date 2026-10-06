import { shaftCollarModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { ShaftCollar } from "./ShaftCollar"

export const model = defineModelRenderer({
  name: "shaftcollar",
  schema: shaftCollarModelDefinitionSchema,
  render: ({ fn, ...props }) => <ShaftCollar {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
