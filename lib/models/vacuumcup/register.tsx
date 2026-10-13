import { vacuumCupModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { VacuumCup } from "./VacuumCup"
export const model = defineModelRenderer({
  name: "vacuumcup",
  schema: vacuumCupModelDefinitionSchema,
  render: ({ fn, ...props }) => <VacuumCup {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
