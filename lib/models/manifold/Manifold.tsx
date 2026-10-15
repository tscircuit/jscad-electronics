import type { ManifoldModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createManifoldGeom } from "./geometry"
export type ManifoldProps = ManifoldModelPropsInput & { color?: string }
export function Manifold({ color = "#87929f", ...props }: ManifoldProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createManifoldGeom(props)} />
    </Colorize>
  )
}
