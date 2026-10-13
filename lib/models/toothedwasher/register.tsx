import { toothedWasherModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { ToothedWasher } from "./ToothedWasher"
export const model = defineModelRenderer({
  name: "toothedwasher",
  schema: toothedWasherModelDefinitionSchema,
  render: ({ fn, ...props }) => <ToothedWasher {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
