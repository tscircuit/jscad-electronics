import type { StepBlockModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createStepBlockGeom } from "./geometry"
export type StepBlockProps = StepBlockModelPropsInput & { color?: string }
export function StepBlock({ color = "#929da9", ...props }: StepBlockProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createStepBlockGeom(props)} />
    </Colorize>
  )
}
