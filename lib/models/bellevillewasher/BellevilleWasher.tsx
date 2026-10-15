import {
  getBellevilleWasherDimensions,
  type BellevilleWasherModelPropsInput,
} from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import {
  geom3ToIndexedMesh,
  type IndustrialIndexedMesh,
} from "../../mechanical/geom3-to-indexed-mesh"
import { profiledRing } from "../flatwasher/geometry-utils"
export type BellevilleWasherProps = BellevilleWasherModelPropsInput & {
  color?: string
}
/** Nominal visual envelope with smooth thread surfaces where applicable. */
export function createBellevilleWasherGeom(
  input: BellevilleWasherModelPropsInput = {},
) {
  const p = getBellevilleWasherDimensions(input)
  return profiledRing(
    p.innerDiameter,
    p.outerDiameter,
    p.thickness,
    (_a, outside) => (outside ? 0 : p.coneHeight),
  )
}
export function createBellevilleWasherMesh(
  input: BellevilleWasherModelPropsInput = {},
): IndustrialIndexedMesh {
  return geom3ToIndexedMesh(createBellevilleWasherGeom(input))
}
export function BellevilleWasher({
  color = "#929da9",
  ...props
}: BellevilleWasherProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createBellevilleWasherGeom(props)} />
    </Colorize>
  )
}
