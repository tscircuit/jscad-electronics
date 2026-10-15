import { pipePlugModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PipePlug } from "./PipePlug"
export const model = defineModelRenderer({
  name: "pipeplug",
  schema: pipePlugModelDefinitionSchema,
  render: ({ fn, ...props }) => <PipePlug {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
