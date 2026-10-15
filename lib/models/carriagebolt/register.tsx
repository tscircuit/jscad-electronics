import { carriageBoltModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { CarriageBolt } from "./CarriageBolt"
export const model = defineModelRenderer({
  name: "carriagebolt",
  schema: carriageBoltModelDefinitionSchema,
  render: ({ fn, ...props }) => <CarriageBolt {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
