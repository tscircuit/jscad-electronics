import { femaleStandoffModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { FemaleStandoff } from "./FemaleStandoff"

export const model = defineModelRenderer({
  name: "femalestandoff",
  schema: femaleStandoffModelDefinitionSchema,
  render: ({ fn, ...props }) => <FemaleStandoff {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
