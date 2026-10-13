import { vBeltSheaveModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { VBeltSheave } from "./VBeltSheave"
export const model = defineModelRenderer({
  name: "vbeltsheave",
  schema: vBeltSheaveModelDefinitionSchema,
  render: ({ fn, ...props }) => <VBeltSheave {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
