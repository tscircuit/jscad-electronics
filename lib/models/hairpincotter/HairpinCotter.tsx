import {
  getHairpinCotterDimensions,
  type HairpinCotterModelPropsInput,
} from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import {
  geom3ToIndexedMesh,
  type IndustrialIndexedMesh,
} from "../../mechanical/geom3-to-indexed-mesh"
import { wirePath, type Point } from "../flatwasher/geometry-utils"
export type HairpinCotterProps = HairpinCotterModelPropsInput & {
  color?: string
}
/** Nominal visual envelope with smooth thread surfaces where applicable. */
export function createHairpinCotterGeom(
  input: HairpinCotterModelPropsInput = {},
) {
  const p = getHairpinCotterDimensions(input)
  const r = (p.loopDiameter - p.wireDiameter) / 2,
    center = r + p.wireDiameter / 2,
    tip = p.length - p.wireDiameter / 2,
    path: Point[] = [
      [-r, tip, p.wireDiameter / 2],
      [-r, center, p.wireDiameter / 2],
    ]
  for (let i = 1; i <= 40; i++) {
    const a = Math.PI + (i * Math.PI) / 40
    path.push([r * Math.cos(a), center + r * Math.sin(a), p.wireDiameter / 2])
  }
  for (let i = 1; i <= 48; i++) {
    const y = center + (i * (tip - center)) / 48
    path.push([
      r * (0.65 + 0.25 * Math.cos((i * Math.PI * 4) / 48)),
      y,
      p.wireDiameter / 2,
    ])
  }
  return wirePath(path, p.wireDiameter)
}
export function createHairpinCotterMesh(
  input: HairpinCotterModelPropsInput = {},
): IndustrialIndexedMesh {
  return geom3ToIndexedMesh(createHairpinCotterGeom(input))
}
export function HairpinCotter({
  color = "#929da9",
  ...props
}: HairpinCotterProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createHairpinCotterGeom(props)} />
    </Colorize>
  )
}
