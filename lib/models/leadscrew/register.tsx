import { leadScrewModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { LeadScrew } from "./LeadScrew"
export const model = defineModelRenderer({
  name: "leadscrew",
  schema: leadScrewModelDefinitionSchema,
  render: ({ fn, ...props }) => <LeadScrew {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
