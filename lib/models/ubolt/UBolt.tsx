import {
  getUBoltDimensions,
  type UBoltModelPropsInput,
} from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import {
  geom3ToIndexedMesh,
  type IndustrialIndexedMesh,
} from "../../mechanical/geom3-to-indexed-mesh"
import { wirePath, type Point } from "../flatwasher/geometry-utils"
export type UBoltProps = UBoltModelPropsInput & { color?: string }
/** Nominal visual envelope with smooth thread surfaces where applicable. */
export function createUBoltGeom(input: UBoltModelPropsInput = {}) {
  const p = getUBoltDimensions(input)
  const r = p.legSpacing / 2,
    path: Point[] = [
      [-r, 0, 0],
      [-r, 0, p.legLength],
    ]
  for (let i = 1; i <= 48; i++) {
    const a = (i * Math.PI) / 48
    path.push([-r * Math.cos(a), 0, p.legLength + r * Math.sin(a)])
  }
  path.push([r, 0, 0])
  return wirePath(path, p.rodDiameter)
}
export function createUBoltMesh(
  input: UBoltModelPropsInput = {},
): IndustrialIndexedMesh {
  return geom3ToIndexedMesh(createUBoltGeom(input))
}
export function UBolt({ color = "#929da9", ...props }: UBoltProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createUBoltGeom(props)} />
    </Colorize>
  )
}
