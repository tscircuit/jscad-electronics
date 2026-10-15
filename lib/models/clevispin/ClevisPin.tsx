import {
  getClevisPinDimensions,
  type ClevisPinModelPropsInput,
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
  rotateX,
  cylinder,
  round,
} from "../flatwasher/geometry-utils"
export type ClevisPinProps = ClevisPinModelPropsInput & { color?: string }
/** Nominal visual envelope with smooth thread surfaces where applicable. */
export function createClevisPinGeom(input: ClevisPinModelPropsInput = {}) {
  const p = getClevisPinDimensions(input)
  const crossHole = translate(
    [0, 0, p.holeOffset],
    rotateX(
      Math.PI / 2,
      cylinder({
        radius: p.holeDiameter / 2,
        height: p.shaftDiameter + 2,
        segments: 40,
      }),
    ),
  )
  return subtract(
    union(
      round(p.shaftDiameter, p.shaftLength),
      round(p.headDiameter, p.headHeight, p.shaftLength),
    ),
    crossHole,
  )
}
export function createClevisPinMesh(
  input: ClevisPinModelPropsInput = {},
): IndustrialIndexedMesh {
  return geom3ToIndexedMesh(createClevisPinGeom(input))
}
export function ClevisPin({ color = "#929da9", ...props }: ClevisPinProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createClevisPinGeom(props)} />
    </Colorize>
  )
}
