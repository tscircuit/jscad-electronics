import type { DrawLatchModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createDrawLatchGeom } from "./geometry"
export type DrawLatchProps = DrawLatchModelPropsInput & { color?: string }
export function DrawLatch({ color = "#929da9", ...props }: DrawLatchProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createDrawLatchGeom(props)} />
    </Colorize>
  )
}
