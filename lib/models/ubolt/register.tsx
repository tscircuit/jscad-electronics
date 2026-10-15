import { uBoltModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { UBolt } from "./UBolt"
export const model = defineModelRenderer({
  name: "ubolt",
  schema: uBoltModelDefinitionSchema,
  render: ({ fn, ...props }) => <UBolt {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
