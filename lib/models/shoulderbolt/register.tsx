import { shoulderBoltModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { ShoulderBolt } from "./ShoulderBolt"
export const model = defineModelRenderer({
  name: "shoulderbolt",
  schema: shoulderBoltModelDefinitionSchema,
  render: ({ fn, ...props }) => <ShoulderBolt {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
