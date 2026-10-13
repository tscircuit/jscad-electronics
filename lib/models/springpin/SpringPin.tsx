import {
  getSpringPinDimensions,
  type SpringPinModelPropsInput,
} from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import {
  geom3ToIndexedMesh,
  type IndustrialIndexedMesh,
} from "../../mechanical/geom3-to-indexed-mesh"
import { subtract, cuboid, round, bore } from "../flatwasher/geometry-utils"
export type SpringPinProps = SpringPinModelPropsInput & { color?: string }
/** Nominal visual envelope with smooth thread surfaces where applicable. */
export function createSpringPinGeom(input: SpringPinModelPropsInput = {}) {
  const p = getSpringPinDimensions(input)
  const slot = cuboid({
    size: [p.outerDiameter, p.gapWidth, p.length + 2],
    center: [p.outerDiameter / 2, 0, p.length / 2],
  })
  return subtract(
    round(p.outerDiameter, p.length),
    bore(p.outerDiameter - 2 * p.wallThickness, p.length),
    slot,
  )
}
export function createSpringPinMesh(
  input: SpringPinModelPropsInput = {},
): IndustrialIndexedMesh {
  return geom3ToIndexedMesh(createSpringPinGeom(input))
}
export function SpringPin({ color = "#929da9", ...props }: SpringPinProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createSpringPinGeom(props)} />
    </Colorize>
  )
}
