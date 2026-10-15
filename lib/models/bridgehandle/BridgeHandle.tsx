import type { BridgeHandleModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createBridgeHandleGeom } from "./geometry"
export type BridgeHandleProps = BridgeHandleModelPropsInput & { color?: string }
export function BridgeHandle({
  color = "#929da9",
  ...props
}: BridgeHandleProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createBridgeHandleGeom(props)} />
    </Colorize>
  )
}
