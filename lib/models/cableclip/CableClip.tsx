import type { CableClipModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createCableClipGeom } from "./geometry"
export type CableClipProps = CableClipModelPropsInput & { color?: string }
export function CableClip({ color = "#465e72", ...props }: CableClipProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createCableClipGeom(props)} />
    </Colorize>
  )
}
