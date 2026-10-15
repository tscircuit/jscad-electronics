import type { PushConnectFittingModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPushConnectFittingGeom } from "./geometry"
export type PushConnectFittingProps = PushConnectFittingModelPropsInput & {
  color?: string
}
export function PushConnectFitting({
  color = "#87929f",
  ...props
}: PushConnectFittingProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPushConnectFittingGeom(props)} />
    </Colorize>
  )
}
