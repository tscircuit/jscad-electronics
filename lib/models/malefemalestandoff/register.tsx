import { maleFemaleStandoffModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { MaleFemaleStandoff } from "./MaleFemaleStandoff"
export const model = defineModelRenderer({
  name: "malefemalestandoff",
  schema: maleFemaleStandoffModelDefinitionSchema,
  render: ({ fn, ...props }) => <MaleFemaleStandoff {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
