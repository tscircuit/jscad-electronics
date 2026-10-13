import type { PilotLightModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPilotLightGeom } from "./geometry"
export type PilotLightProps = PilotLightModelPropsInput & { color?: string }
export function PilotLight({ color = "#929da9", ...props }: PilotLightProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPilotLightGeom(props)} />
    </Colorize>
  )
}
