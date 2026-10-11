import { hatSectionModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { HatSection } from "./HatSection"
export const model = defineModelRenderer({
  name: "hatsection",
  schema: hatSectionModelDefinitionSchema,
  render: ({ fn, ...props }) => <HatSection {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
