import type { TSlotPanelRetainerModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createTSlotPanelRetainerMesh } from "./mesh"
export type TSlotPanelRetainerProps = TSlotPanelRetainerModelPropsInput & {
  color?: string
}
export function createTSlotPanelRetainerGeom(
  input: TSlotPanelRetainerModelPropsInput,
) {
  return indexedMeshToGeom3(createTSlotPanelRetainerMesh(input))
}
export function TSlotPanelRetainer({
  color = "#8995a3",
  ...props
}: TSlotPanelRetainerProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createTSlotPanelRetainerGeom(props)} />
    </Colorize>
  )
}
export { createTSlotPanelRetainerMesh } from "./mesh"
export type { TSlotPanelRetainerMesh } from "./mesh"
