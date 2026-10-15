import {
  getCouplingNutDimensions,
  type CouplingNutModelPropsInput,
} from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import {
  geom3ToIndexedMesh,
  type IndustrialIndexedMesh,
} from "../../mechanical/geom3-to-indexed-mesh"
import { subtract, hex, bore } from "../flatwasher/geometry-utils"
export type CouplingNutProps = CouplingNutModelPropsInput & { color?: string }
/** Nominal visual envelope with smooth thread surfaces where applicable. */
export function createCouplingNutGeom(input: CouplingNutModelPropsInput = {}) {
  const p = getCouplingNutDimensions(input)
  return subtract(hex(p.acrossFlats, p.height), bore(p.boreDiameter, p.height))
}
export function createCouplingNutMesh(
  input: CouplingNutModelPropsInput = {},
): IndustrialIndexedMesh {
  return geom3ToIndexedMesh(createCouplingNutGeom(input))
}
export function CouplingNut({ color = "#929da9", ...props }: CouplingNutProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createCouplingNutGeom(props)} />
    </Colorize>
  )
}
