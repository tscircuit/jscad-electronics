import type { RollerChainModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createRollerChainGeom } from "./geometry"
export type RollerChainProps = RollerChainModelPropsInput & { color?: string }
export function RollerChain({ color = "#929da9", ...props }: RollerChainProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createRollerChainGeom(props)} />
    </Colorize>
  )
}
