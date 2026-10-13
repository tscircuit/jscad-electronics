import {
  getCapNutDimensions,
  type CapNutModelPropsInput,
} from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import {
  geom3ToIndexedMesh,
  type IndustrialIndexedMesh,
} from "../../mechanical/geom3-to-indexed-mesh"
import {
  union,
  subtract,
  intersect,
  translate,
  scale,
  cuboid,
  sphere,
  round,
  hex,
} from "../flatwasher/geometry-utils"
export type CapNutProps = CapNutModelPropsInput & { color?: string }
/** Nominal visual envelope with smooth thread surfaces where applicable. */
export function createCapNutGeom(input: CapNutModelPropsInput = {}) {
  const p = getCapNutDimensions(input)
  const radius = p.acrossFlats / 2
  const cap = translate(
    [0, 0, p.bodyHeight],
    scale(
      [1, 1, p.capHeight / radius],
      intersect(
        sphere({ radius, segments: 48 }),
        cuboid({
          size: [radius * 3, radius * 3, radius],
          center: [0, 0, radius / 2],
        }),
      ),
    ),
  )
  return subtract(
    union(hex(p.acrossFlats, p.bodyHeight), cap),
    round(p.boreDiameter, p.bodyHeight - p.wallThickness + 1, -1),
  )
}
export function createCapNutMesh(
  input: CapNutModelPropsInput = {},
): IndustrialIndexedMesh {
  return geom3ToIndexedMesh(createCapNutGeom(input))
}
export function CapNut({ color = "#929da9", ...props }: CapNutProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createCapNutGeom(props)} />
    </Colorize>
  )
}
