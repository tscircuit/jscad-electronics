import { leverHandleModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { LeverHandle } from "./LeverHandle"
export const model = defineModelRenderer({
  name: "leverhandle",
  schema: leverHandleModelDefinitionSchema,
  render: ({ fn, ...props }) => <LeverHandle {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
