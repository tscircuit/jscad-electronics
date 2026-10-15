import {
  getSolidRivetDimensions,
  type SolidRivetModelPropsInput,
} from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import {
  geom3ToIndexedMesh,
  type IndustrialIndexedMesh,
} from "../../mechanical/geom3-to-indexed-mesh"
import { union, round, dome } from "../flatwasher/geometry-utils"
export type SolidRivetProps = SolidRivetModelPropsInput & { color?: string }
/** Nominal visual envelope with smooth thread surfaces where applicable. */
export function createSolidRivetGeom(input: SolidRivetModelPropsInput = {}) {
  const p = getSolidRivetDimensions(input)
  return union(
    round(p.shaftDiameter, p.shaftLength),
    dome(p.headDiameter, p.headHeight, p.shaftLength),
  )
}
export function createSolidRivetMesh(
  input: SolidRivetModelPropsInput = {},
): IndustrialIndexedMesh {
  return geom3ToIndexedMesh(createSolidRivetGeom(input))
}
export function SolidRivet({ color = "#929da9", ...props }: SolidRivetProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createSolidRivetGeom(props)} />
    </Colorize>
  )
}
