import { eyeBoltModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { EyeBolt } from "./EyeBolt"
export const model = defineModelRenderer({
  name: "eyebolt",
  schema: eyeBoltModelDefinitionSchema,
  render: ({ fn, ...props }) => <EyeBolt {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
