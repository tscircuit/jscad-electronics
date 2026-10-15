import type { PhotoelectricSensorModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPhotoelectricSensorGeom } from "./geometry"
export type PhotoelectricSensorProps = PhotoelectricSensorModelPropsInput & {
  color?: string
}
export function PhotoelectricSensor({
  color = "#929da9",
  ...props
}: PhotoelectricSensorProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createPhotoelectricSensorGeom(props)} />
    </Colorize>
  )
}
