import { threadedRodModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { ThreadedRod } from "./ThreadedRod"

export const model = defineModelRenderer({
  name: "threadedrod",
  schema: threadedRodModelDefinitionSchema,
  render: ({ fn, ...props }) => <ThreadedRod {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
