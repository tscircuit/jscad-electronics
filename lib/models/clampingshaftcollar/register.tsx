import { clampingShaftCollarModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { ClampingShaftCollar } from "./ClampingShaftCollar"

export const model = defineModelRenderer({
  name: "clampingshaftcollar",
  schema: clampingShaftCollarModelDefinitionSchema,
  render: ({ fn, ...props }) => <ClampingShaftCollar {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
