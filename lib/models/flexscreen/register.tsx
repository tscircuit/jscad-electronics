import { flexScreenModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { FlexScreen } from "../../FlexScreen"

export const model = defineModelRenderer({
  name: "flexscreen",
  schema: flexScreenModelDefinitionSchema,
  render: ({ fn, ...props }) => <FlexScreen {...props} />,
  pads: "footprinter",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
