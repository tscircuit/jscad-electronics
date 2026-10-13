import { sphericalBearingModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { SphericalBearing } from "./SphericalBearing"
export const model = defineModelRenderer({
  name: "sphericalbearing",
  schema: sphericalBearingModelDefinitionSchema,
  render: ({ fn, ...props }) => <SphericalBearing {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
