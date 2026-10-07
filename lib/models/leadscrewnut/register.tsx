import { leadScrewNutModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { LeadScrewNut } from "./LeadScrewNut"
export const model = defineModelRenderer({
  name: "leadscrewnut",
  schema: leadScrewNutModelDefinitionSchema,
  render: ({ fn, ...props }) => <LeadScrewNut {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
