import { fixturePlateModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { FixturePlate } from "./FixturePlate"
export const model = defineModelRenderer({
  name: "fixtureplate",
  schema: fixturePlateModelDefinitionSchema,
  render: ({ fn, ...props }) => <FixturePlate {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
