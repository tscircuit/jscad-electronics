import type { RubberBumperModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createRubberBumperGeom } from "./geometry"
export type RubberBumperProps = RubberBumperModelPropsInput & { color?: string }
export function RubberBumper({
  color = "#929da9",
  ...props
}: RubberBumperProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createRubberBumperGeom(props)} />
    </Colorize>
  )
}
