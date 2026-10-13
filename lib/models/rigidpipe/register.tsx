import { rigidPipeModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { RigidPipe } from "./RigidPipe"
export const model = defineModelRenderer({
  name: "rigidpipe",
  schema: rigidPipeModelDefinitionSchema,
  render: ({ fn, ...props }) => <RigidPipe {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
