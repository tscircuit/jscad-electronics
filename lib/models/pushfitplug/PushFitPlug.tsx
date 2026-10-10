import type { PushFitPlugModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPushFitPlugGeom } from "./geometry"
export type PushFitPlugProps = PushFitPlugModelPropsInput & { color?: string }
export function PushFitPlug({ color = "#929da9", ...props }: PushFitPlugProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPushFitPlugGeom(props)} />
    </Colorize>
  )
}
