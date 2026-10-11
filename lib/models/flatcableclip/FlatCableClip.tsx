import type { FlatCableClipModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createFlatCableClipGeom } from "./geometry"
export type FlatCableClipProps = FlatCableClipModelPropsInput & {
  color?: string
}
export function FlatCableClip({
  color = "#465e72",
  ...props
}: FlatCableClipProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createFlatCableClipGeom(props)} />
    </Colorize>
  )
}
