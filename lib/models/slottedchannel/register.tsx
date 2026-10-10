import { slottedChannelModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { SlottedChannel } from "./SlottedChannel"
export const model = defineModelRenderer({
  name: "slottedchannel",
  schema: slottedChannelModelDefinitionSchema,
  render: ({ fn, ...props }) => <SlottedChannel {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
