import type { CamFollowerModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createCamFollowerGeom } from "./geometry"
export type CamFollowerProps = CamFollowerModelPropsInput & { color?: string }
export function CamFollower({ color = "#929da9", ...props }: CamFollowerProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createCamFollowerGeom(props)} />
    </Colorize>
  )
}
