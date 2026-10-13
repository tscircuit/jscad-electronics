import type { PushbuttonOperatorModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPushbuttonOperatorGeom } from "./geometry"
export type PushbuttonOperatorProps = PushbuttonOperatorModelPropsInput & {
  color?: string
}
export function PushbuttonOperator({
  color = "#929da9",
  ...props
}: PushbuttonOperatorProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPushbuttonOperatorGeom(props)} />
    </Colorize>
  )
}
