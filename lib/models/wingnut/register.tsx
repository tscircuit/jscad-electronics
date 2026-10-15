import { wingNutModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { WingNut } from "./WingNut"
export const model = defineModelRenderer({
  name: "wingnut",
  schema: wingNutModelDefinitionSchema,
  render: ({ fn, ...props }) => <WingNut {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
