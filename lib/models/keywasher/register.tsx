import { keyWasherModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { KeyWasher } from "./KeyWasher"
export const model = defineModelRenderer({
  name: "keywasher",
  schema: keyWasherModelDefinitionSchema,
  render: ({ fn, ...props }) => <KeyWasher {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
