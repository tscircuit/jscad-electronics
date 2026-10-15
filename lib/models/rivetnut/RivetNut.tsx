import {
  getRivetNutDimensions,
  type RivetNutModelPropsInput,
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
  rotateZ,
  cuboid,
  round,
  bore,
} from "../flatwasher/geometry-utils"
export type RivetNutProps = RivetNutModelPropsInput & { color?: string }
/** Nominal visual envelope with smooth thread surfaces where applicable. */
export function createRivetNutGeom(input: RivetNutModelPropsInput = {}) {
  const p = getRivetNutDimensions(input)
  const grooves = []
  for (let i = 0; i < 24; i++)
    grooves.push(
      rotateZ(
        (i * Math.PI) / 12,
        translate(
          [p.bodyDiameter / 2, 0, p.bodyLength / 2],
          cuboid({
            size: [
              p.bodyDiameter * 0.045,
              p.bodyDiameter * 0.045,
              p.bodyLength * 0.7,
            ],
          }),
        ),
      ),
    )
  return subtract(
    union(
      round(p.bodyDiameter, p.bodyLength),
      round(p.flangeDiameter, p.flangeThickness, p.bodyLength),
    ),
    bore(p.boreDiameter, p.bodyLength + p.flangeThickness),
    ...grooves,
  )
}
export function createRivetNutMesh(
  input: RivetNutModelPropsInput = {},
): IndustrialIndexedMesh {
  return geom3ToIndexedMesh(createRivetNutGeom(input))
}
export function RivetNut({ color = "#929da9", ...props }: RivetNutProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createRivetNutGeom(props)} />
    </Colorize>
  )
}
