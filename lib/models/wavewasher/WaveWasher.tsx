import {
  getWaveWasherDimensions,
  type WaveWasherModelPropsInput,
} from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import {
  geom3ToIndexedMesh,
  type IndustrialIndexedMesh,
} from "../../mechanical/geom3-to-indexed-mesh"
import { profiledRing } from "../flatwasher/geometry-utils"
export type WaveWasherProps = WaveWasherModelPropsInput & { color?: string }
/** Nominal visual envelope with smooth thread surfaces where applicable. */
export function createWaveWasherGeom(input: WaveWasherModelPropsInput = {}) {
  const p = getWaveWasherDimensions(input)
  return profiledRing(
    p.innerDiameter,
    p.outerDiameter,
    p.thickness,
    (a) => (p.waveHeight * (1 - Math.cos(3 * a))) / 2,
  )
}
export function createWaveWasherMesh(
  input: WaveWasherModelPropsInput = {},
): IndustrialIndexedMesh {
  return geom3ToIndexedMesh(createWaveWasherGeom(input))
}
export function WaveWasher({ color = "#929da9", ...props }: WaveWasherProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createWaveWasherGeom(props)} />
    </Colorize>
  )
}
