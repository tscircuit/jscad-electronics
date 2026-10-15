import {
  getWingNutDimensions,
  type WingNutModelPropsInput,
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
  rotateZ,
  polygon,
  extrudeLinear,
  hex,
  bore,
} from "../flatwasher/geometry-utils"
export type WingNutProps = WingNutModelPropsInput & { color?: string }
/** Nominal visual envelope with smooth thread surfaces where applicable. */
export function createWingNutGeom(input: WingNutModelPropsInput = {}) {
  const p = getWingNutDimensions(input)
  const wing = extrudeLinear(
    { height: p.wingThickness },
    polygon({
      points: [
        [p.acrossFlats / 3, 0],
        [p.wingSpan / 2, p.wingHeight * 0.45],
        [p.wingSpan / 2, p.wingHeight * 0.8],
        [p.wingSpan * 0.4, p.wingHeight],
        [p.acrossFlats / 3, p.bodyHeight],
      ],
    }),
  )
  const right = translate(
    [0, p.wingThickness / 2, 0],
    rotateX(Math.PI / 2, wing),
  )
  return subtract(
    union(hex(p.acrossFlats, p.bodyHeight), right, rotateZ(Math.PI, right)),
    bore(p.boreDiameter, p.wingHeight),
  )
}
export function createWingNutMesh(
  input: WingNutModelPropsInput = {},
): IndustrialIndexedMesh {
  return geom3ToIndexedMesh(createWingNutGeom(input))
}
export function WingNut({ color = "#929da9", ...props }: WingNutProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createWingNutGeom(props)} />
    </Colorize>
  )
}
