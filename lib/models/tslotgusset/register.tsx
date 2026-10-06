import { tSlotGussetModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { TSlotGusset } from "./TSlotGusset"

export const model = defineModelRenderer({
  name: "tslotgusset",
  schema: tSlotGussetModelDefinitionSchema,
  render: ({ fn, ...props }) => <TSlotGusset {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
