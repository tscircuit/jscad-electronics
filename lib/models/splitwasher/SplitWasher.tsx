import type { SplitWasherModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createSplitWasherMesh } from "./mesh"
export type SplitWasherProps = SplitWasherModelPropsInput & { color?: string }
export function createSplitWasherGeom(input: SplitWasherModelPropsInput) {
  return indexedMeshToGeom3(createSplitWasherMesh(input))
}
export function SplitWasher({ color = "#929ba6", ...props }: SplitWasherProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createSplitWasherGeom(props)} />
    </Colorize>
  )
}
export { createSplitWasherMesh } from "./mesh"
export type { SplitWasherMesh, SplitWasherMeshOptions } from "./mesh"
