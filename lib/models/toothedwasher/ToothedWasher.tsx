import {
  getToothedWasherDimensions,
  type ToothedWasherModelPropsInput,
} from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import {
  geom3ToIndexedMesh,
  type IndustrialIndexedMesh,
} from "../../mechanical/geom3-to-indexed-mesh"
import {
  subtract,
  polygon,
  extrudeLinear,
  bore,
} from "../flatwasher/geometry-utils"
export type ToothedWasherProps = ToothedWasherModelPropsInput & {
  color?: string
}
/** Nominal visual envelope with smooth thread surfaces where applicable. */
export function createToothedWasherGeom(
  input: ToothedWasherModelPropsInput = {},
) {
  const p = getToothedWasherDimensions(input)
  const points: [number, number][] = []
  for (let i = 0; i < 48; i++) {
    const a = (i * Math.PI) / 24
    const radius =
      p.outerDiameter / 2 - (i % 4 === 0 || i % 4 === 3 ? p.toothDepth : 0)
    points.push([radius * Math.cos(a), radius * Math.sin(a)])
  }
  return subtract(
    extrudeLinear({ height: p.thickness }, polygon({ points })),
    bore(p.innerDiameter, p.thickness),
  )
}
export function createToothedWasherMesh(
  input: ToothedWasherModelPropsInput = {},
): IndustrialIndexedMesh {
  return geom3ToIndexedMesh(createToothedWasherGeom(input))
}
export function ToothedWasher({
  color = "#929da9",
  ...props
}: ToothedWasherProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createToothedWasherGeom(props)} />
    </Colorize>
  )
}
