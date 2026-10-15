import {
  getEyeBoltDimensions,
  type EyeBoltModelPropsInput,
} from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import {
  geom3ToIndexedMesh,
  type IndustrialIndexedMesh,
} from "../../mechanical/geom3-to-indexed-mesh"
import {
  union,
  translate,
  rotateX,
  torus,
  round,
} from "../flatwasher/geometry-utils"
export type EyeBoltProps = EyeBoltModelPropsInput & { color?: string }
/** Nominal visual envelope with smooth thread surfaces where applicable. */
export function createEyeBoltGeom(input: EyeBoltModelPropsInput = {}) {
  const p = getEyeBoltDimensions(input)
  const r = p.eyeInnerDiameter / 2 + p.eyeWireDiameter / 2
  const eye = translate(
    [0, 0, p.shaftLength + r],
    rotateX(
      Math.PI / 2,
      torus({
        innerRadius: p.eyeWireDiameter / 2,
        outerRadius: r,
        innerSegments: 20,
        outerSegments: 64,
      }),
    ),
  )
  return union(
    round(p.shaftDiameter, p.shaftLength + p.eyeWireDiameter / 2),
    eye,
  )
}
export function createEyeBoltMesh(
  input: EyeBoltModelPropsInput = {},
): IndustrialIndexedMesh {
  return geom3ToIndexedMesh(createEyeBoltGeom(input))
}
export function EyeBolt({ color = "#929da9", ...props }: EyeBoltProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createEyeBoltGeom(props)} />
    </Colorize>
  )
}
