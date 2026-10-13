import {
  getTaperPinDimensions,
  type TaperPinModelPropsInput,
} from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import {
  geom3ToIndexedMesh,
  type IndustrialIndexedMesh,
} from "../../mechanical/geom3-to-indexed-mesh"
import { cylinderElliptic } from "../flatwasher/geometry-utils"
export type TaperPinProps = TaperPinModelPropsInput & { color?: string }
/** Nominal visual envelope with smooth thread surfaces where applicable. */
export function createTaperPinGeom(input: TaperPinModelPropsInput = {}) {
  const p = getTaperPinDimensions(input)
  return cylinderElliptic({
    height: p.length,
    startRadius: [p.largeDiameter / 2, p.largeDiameter / 2],
    endRadius: [p.smallDiameter / 2, p.smallDiameter / 2],
    center: [0, 0, p.length / 2],
    segments: 64,
  })
}
export function createTaperPinMesh(
  input: TaperPinModelPropsInput = {},
): IndustrialIndexedMesh {
  return geom3ToIndexedMesh(createTaperPinGeom(input))
}
export function TaperPin({ color = "#929da9", ...props }: TaperPinProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createTaperPinGeom(props)} />
    </Colorize>
  )
}
