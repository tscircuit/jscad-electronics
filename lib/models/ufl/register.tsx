import { uflModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { Ufl } from "./Ufl"

export const model = defineModelRenderer({
  name: "ufl",
  schema: uflModelDefinitionSchema,
  render: ({ fn, ...props }) => <Ufl {...props} />,
  pads: "footprinter",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
