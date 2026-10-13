import type { CylinderMountModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createCylinderMountGeom } from "./geometry"
export type CylinderMountProps = CylinderMountModelPropsInput & {
  color?: string
}
export function CylinderMount({
  color = "#929da9",
  ...props
}: CylinderMountProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createCylinderMountGeom(props)} />
    </Colorize>
  )
}
