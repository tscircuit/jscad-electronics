import { photoelectricSensorModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { PhotoelectricSensor } from "./PhotoelectricSensor"
export const model = defineModelRenderer({
  name: "photoelectricsensor",
  schema: photoelectricSensorModelDefinitionSchema,
  render: ({ fn, ...props }) => <PhotoelectricSensor {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
