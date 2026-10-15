import {
  getBlindRivetDimensions,
  type BlindRivetModelPropsInput,
} from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import {
  geom3ToIndexedMesh,
  type IndustrialIndexedMesh,
} from "../../mechanical/geom3-to-indexed-mesh"
import { union, subtract, round, bore } from "../flatwasher/geometry-utils"
export type BlindRivetProps = BlindRivetModelPropsInput & { color?: string }
/** Nominal visual envelope with smooth thread surfaces where applicable. */
export function createBlindRivetGeom(input: BlindRivetModelPropsInput = {}) {
  const p = getBlindRivetDimensions(input)
  const tube = subtract(
    union(
      round(p.bodyDiameter, p.bodyLength),
      round(p.flangeDiameter, p.flangeThickness, p.bodyLength),
    ),
    bore(p.mandrelDiameter * 1.1, p.bodyLength + p.flangeThickness),
  )
  return union(
    tube,
    round(p.mandrelDiameter, p.mandrelLength),
    round(p.bodyDiameter * 0.92, p.bodyDiameter * 0.6),
  )
}
export function createBlindRivetMesh(
  input: BlindRivetModelPropsInput = {},
): IndustrialIndexedMesh {
  return geom3ToIndexedMesh(createBlindRivetGeom(input))
}
export function BlindRivet({ color = "#929da9", ...props }: BlindRivetProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createBlindRivetGeom(props)} />
    </Colorize>
  )
}
