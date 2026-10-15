import type { WoodruffKeyModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createWoodruffKeyGeom } from "./geometry"
export type WoodruffKeyProps = WoodruffKeyModelPropsInput & { color?: string }
export function WoodruffKey({ color = "#929da9", ...props }: WoodruffKeyProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createWoodruffKeyGeom(props)} />
    </Colorize>
  )
}
