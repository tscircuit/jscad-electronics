import { waveWasherModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { WaveWasher } from "./WaveWasher"
export const model = defineModelRenderer({
  name: "wavewasher",
  schema: waveWasherModelDefinitionSchema,
  render: ({ fn, ...props }) => <WaveWasher {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
