import { cableGrommetModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { CableGrommet } from "./CableGrommet"

export const model = defineModelRenderer({
  name: "cablegrommet",
  schema: cableGrommetModelDefinitionSchema,
  render: ({ fn, ...props }) => <CableGrommet {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
