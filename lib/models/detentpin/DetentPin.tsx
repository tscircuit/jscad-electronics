import type { DetentPinModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createDetentPinGeom } from "./geometry"
export type DetentPinProps = DetentPinModelPropsInput & { color?: string }
export function DetentPin({ color = "#929da9", ...props }: DetentPinProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createDetentPinGeom(props)} />
    </Colorize>
  )
}
