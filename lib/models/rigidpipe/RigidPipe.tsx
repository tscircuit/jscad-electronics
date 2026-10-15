import type { RigidPipeModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createRigidPipeGeom } from "./geometry"
export type RigidPipeProps = RigidPipeModelPropsInput & { color?: string }
export function RigidPipe({ color = "#87929f", ...props }: RigidPipeProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createRigidPipeGeom(props)} />
    </Colorize>
  )
}
