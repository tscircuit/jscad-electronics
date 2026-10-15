import { rivetNutModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { RivetNut } from "./RivetNut"
export const model = defineModelRenderer({
  name: "rivetnut",
  schema: rivetNutModelDefinitionSchema,
  render: ({ fn, ...props }) => <RivetNut {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
