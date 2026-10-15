import {
  getCarriageBoltDimensions,
  type CarriageBoltModelPropsInput,
} from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import {
  geom3ToIndexedMesh,
  type IndustrialIndexedMesh,
} from "../../mechanical/geom3-to-indexed-mesh"
import { union, cuboid, round, dome } from "../flatwasher/geometry-utils"
export type CarriageBoltProps = CarriageBoltModelPropsInput & { color?: string }
/** Nominal visual envelope with smooth thread surfaces where applicable. */
export function createCarriageBoltGeom(
  input: CarriageBoltModelPropsInput = {},
) {
  const p = getCarriageBoltDimensions(input)
  const z = p.shaftLength + p.neckHeight
  return union(
    round(p.shaftDiameter, p.shaftLength),
    cuboid({
      size: [p.neckWidth, p.neckWidth, p.neckHeight],
      center: [0, 0, p.shaftLength + p.neckHeight / 2],
    }),
    dome(p.headDiameter, p.headHeight, z),
  )
}
export function createCarriageBoltMesh(
  input: CarriageBoltModelPropsInput = {},
): IndustrialIndexedMesh {
  return geom3ToIndexedMesh(createCarriageBoltGeom(input))
}
export function CarriageBolt({
  color = "#929da9",
  ...props
}: CarriageBoltProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createCarriageBoltGeom(props)} />
    </Colorize>
  )
}
