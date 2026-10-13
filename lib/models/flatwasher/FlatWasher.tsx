import {
  getFlatWasherDimensions,
  type FlatWasherModelPropsInput,
} from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import {
  geom3ToIndexedMesh,
  type IndustrialIndexedMesh,
} from "../../mechanical/geom3-to-indexed-mesh"
import { subtract, round, bore } from "./geometry-utils"
export type FlatWasherProps = FlatWasherModelPropsInput & { color?: string }
/** Nominal visual envelope with smooth thread surfaces where applicable. */
export function createFlatWasherGeom(input: FlatWasherModelPropsInput = {}) {
  const p = getFlatWasherDimensions(input)
  return subtract(
    round(p.outerDiameter, p.thickness),
    bore(p.innerDiameter, p.thickness),
  )
}
export function createFlatWasherMesh(
  input: FlatWasherModelPropsInput = {},
): IndustrialIndexedMesh {
  return geom3ToIndexedMesh(createFlatWasherGeom(input))
}
export function FlatWasher({ color = "#929da9", ...props }: FlatWasherProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createFlatWasherGeom(props)} />
    </Colorize>
  )
}
