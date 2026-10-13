import {
  getShoulderBoltDimensions,
  type ShoulderBoltModelPropsInput,
} from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import {
  geom3ToIndexedMesh,
  type IndustrialIndexedMesh,
} from "../../mechanical/geom3-to-indexed-mesh"
import { union, subtract, round, hex } from "../flatwasher/geometry-utils"
export type ShoulderBoltProps = ShoulderBoltModelPropsInput & { color?: string }
/** Nominal visual envelope with smooth thread surfaces where applicable. */
export function createShoulderBoltGeom(
  input: ShoulderBoltModelPropsInput = {},
) {
  const p = getShoulderBoltDimensions(input)
  const top = p.threadLength + p.shoulderLength
  const socket = hex(
    p.headDiameter * 0.38,
    p.headHeight * 0.6,
    top + p.headHeight * 0.4 + 0.01,
  )
  return subtract(
    union(
      round(p.threadDiameter, p.threadLength),
      round(p.shoulderDiameter, p.shoulderLength, p.threadLength),
      round(p.headDiameter, p.headHeight, top),
    ),
    socket,
  )
}
export function createShoulderBoltMesh(
  input: ShoulderBoltModelPropsInput = {},
): IndustrialIndexedMesh {
  return geom3ToIndexedMesh(createShoulderBoltGeom(input))
}
export function ShoulderBolt({
  color = "#929da9",
  ...props
}: ShoulderBoltProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createShoulderBoltGeom(props)} />
    </Colorize>
  )
}
