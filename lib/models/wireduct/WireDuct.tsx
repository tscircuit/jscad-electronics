import type { WireDuctModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createWireDuctGeom } from "./geometry"
export type WireDuctProps = WireDuctModelPropsInput & { color?: string }
export function WireDuct({ color = "#929da9", ...props }: WireDuctProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createWireDuctGeom(props)} />
    </Colorize>
  )
}
