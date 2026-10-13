import type { ConveyorRollerModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createConveyorRollerGeom } from "./geometry"
export type ConveyorRollerProps = ConveyorRollerModelPropsInput & {
  color?: string
}
export function ConveyorRoller({
  color = "#929da9",
  ...props
}: ConveyorRollerProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createConveyorRollerGeom(props)} />
    </Colorize>
  )
}
