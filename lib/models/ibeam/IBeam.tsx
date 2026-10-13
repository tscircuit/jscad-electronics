import type { IBeamModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createIBeamGeom } from "./geometry"
export type IBeamProps = IBeamModelPropsInput & { color?: string }
export function IBeam({ color = "#929da9", ...props }: IBeamProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createIBeamGeom(props)} />
    </Colorize>
  )
}
