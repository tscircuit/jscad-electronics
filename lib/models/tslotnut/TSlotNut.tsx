import {
  getTSlotNutDimensions,
  type TSlotNutModelPropsInput,
} from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import {
  geom3ToIndexedMesh,
  type IndustrialIndexedMesh,
} from "../../mechanical/geom3-to-indexed-mesh"
import { union, subtract, cuboid, bore } from "../flatwasher/geometry-utils"
export type TSlotNutProps = TSlotNutModelPropsInput & { color?: string }
/** Nominal visual envelope with smooth thread surfaces where applicable. */
export function createTSlotNutGeom(input: TSlotNutModelPropsInput = {}) {
  const p = getTSlotNutDimensions(input)
  return subtract(
    union(
      cuboid({
        size: [p.baseWidth, p.length, p.baseHeight],
        center: [0, 0, p.baseHeight / 2],
      }),
      cuboid({
        size: [p.neckWidth, p.length, p.neckHeight],
        center: [0, 0, p.baseHeight + p.neckHeight / 2],
      }),
    ),
    bore(p.boreDiameter, p.baseHeight + p.neckHeight),
  )
}
export function createTSlotNutMesh(
  input: TSlotNutModelPropsInput = {},
): IndustrialIndexedMesh {
  return geom3ToIndexedMesh(createTSlotNutGeom(input))
}
export function TSlotNut({ color = "#929da9", ...props }: TSlotNutProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createTSlotNutGeom(props)} />
    </Colorize>
  )
}
