import type { TorsionSpringModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createTorsionSpringMesh } from "./mesh"
export type TorsionSpringProps = TorsionSpringModelPropsInput & {
  color?: string
}
export function createTorsionSpringGeom(input: TorsionSpringModelPropsInput) {
  return indexedMeshToGeom3(createTorsionSpringMesh(input))
}
export function TorsionSpring({
  color = "#929ba6",
  ...props
}: TorsionSpringProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createTorsionSpringGeom(props)} />
    </Colorize>
  )
}
export { createTorsionSpringMesh } from "./mesh"
export type { TorsionSpringMesh, TorsionSpringMeshOptions } from "./mesh"
