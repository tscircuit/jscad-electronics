import { terminalBlockModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { TerminalBlock } from "./TerminalBlock"
export const model = defineModelRenderer({
  name: "terminalblock",
  schema: terminalBlockModelDefinitionSchema,
  render: ({ fn, ...props }) => <TerminalBlock {...props} />,
  pads: "none",
})
export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
