import type { FixturePlateModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createFixturePlateGeom } from "./geometry"
export type FixturePlateProps = FixturePlateModelPropsInput & { color?: string }
export function FixturePlate({
  color = "#929da9",
  ...props
}: FixturePlateProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createFixturePlateGeom(props)} />
    </Colorize>
  )
}
