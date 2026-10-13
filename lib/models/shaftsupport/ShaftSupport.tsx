import type { ShaftSupportModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createShaftSupportGeom } from "./geometry"
export type ShaftSupportProps = ShaftSupportModelPropsInput & { color?: string }
export function ShaftSupport({
  color = "#929da9",
  ...props
}: ShaftSupportProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createShaftSupportGeom(props)} />
    </Colorize>
  )
}
