import type { LinearBallBearingModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createLinearBallBearingMesh } from "./mesh"

export type LinearBallBearingProps = LinearBallBearingModelPropsInput & {
  color?: string
}

export function createLinearBallBearingGeom(
  input: LinearBallBearingModelPropsInput = {},
) {
  return indexedMeshToGeom3(createLinearBallBearingMesh(input))
}

/** Separately colored physical parts retain their individual closed surfaces. */
export function LinearBallBearing({ color, ...props }: LinearBallBearingProps) {
  const { parts } = createLinearBallBearingMesh(props)
  return (
    <>
      {parts.map((part) => (
        <Colorize key={part.name} color={color ?? part.color}>
          <Custom geometry={indexedMeshToGeom3(part.mesh)} />
        </Colorize>
      ))}
    </>
  )
}

export { createLinearBallBearingMesh } from "./mesh"
export type {
  LinearBallBearingMesh,
  LinearBallBearingMeshPart,
  LinearBallBearingMeshOptions,
} from "./mesh"
