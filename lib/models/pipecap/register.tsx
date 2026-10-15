import { pipeCapModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PipeCap } from "./PipeCap"
export const model = defineModelRenderer({
  name: "pipecap",
  schema: pipeCapModelDefinitionSchema,
  render: ({ fn, ...props }) => <PipeCap {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
