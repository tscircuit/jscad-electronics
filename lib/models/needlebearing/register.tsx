import { needleBearingModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { NeedleBearing } from "./NeedleBearing"
export const model = defineModelRenderer({
  name: "needlebearing",
  schema: needleBearingModelDefinitionSchema,
  render: ({ fn, ...props }) => <NeedleBearing {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
