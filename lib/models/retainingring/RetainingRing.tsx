import {
  getRetainingRingDimensions,
  type RetainingRingModelPropsInput,
} from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import {
  geom3ToIndexedMesh,
  type IndustrialIndexedMesh,
} from "../../mechanical/geom3-to-indexed-mesh"
import {
  union,
  subtract,
  translate,
  cuboid,
  round,
  bore,
} from "../flatwasher/geometry-utils"
export type RetainingRingProps = RetainingRingModelPropsInput & {
  color?: string
}
/** Nominal visual envelope with smooth thread surfaces where applicable. */
export function createRetainingRingGeom(
  input: RetainingRingModelPropsInput = {},
) {
  const p = getRetainingRingDimensions(input)
  const r = (p.innerDiameter + p.outerDiameter) / 4,
    angle = Math.asin(p.gapWidth / (2 * r)),
    holes = [],
    lugs = []
  for (const s of [-1, 1]) {
    const x = r * Math.cos(angle),
      y = s * r * Math.sin(angle)
    lugs.push(translate([x, y, 0], round(p.lugDiameter, p.thickness)))
    holes.push(translate([x, y, 0], bore(p.holeDiameter, p.thickness)))
  }
  const slot = cuboid({
    size: [p.outerDiameter, p.gapWidth, p.thickness + 2],
    center: [p.outerDiameter / 2, 0, p.thickness / 2],
  })
  const ring = subtract(
    round(p.outerDiameter, p.thickness),
    bore(p.innerDiameter, p.thickness),
    slot,
  )
  return subtract(union(ring, ...lugs), ...holes)
}
export function createRetainingRingMesh(
  input: RetainingRingModelPropsInput = {},
): IndustrialIndexedMesh {
  return geom3ToIndexedMesh(createRetainingRingGeom(input))
}
export function RetainingRing({
  color = "#929da9",
  ...props
}: RetainingRingProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createRetainingRingGeom(props)} />
    </Colorize>
  )
}
