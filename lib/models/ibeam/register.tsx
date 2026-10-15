import { iBeamModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { IBeam } from "./IBeam"
export const model = defineModelRenderer({
  name: "ibeam",
  schema: iBeamModelDefinitionSchema,
  render: ({ fn, ...props }) => <IBeam {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
