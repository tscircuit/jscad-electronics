import { channelBarModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { ChannelBar } from "./ChannelBar"
export const model = defineModelRenderer({
  name: "channelbar",
  schema: channelBarModelDefinitionSchema,
  render: ({ fn, ...props }) => <ChannelBar {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
