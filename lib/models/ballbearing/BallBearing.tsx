import type { BallBearingModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createBallBearingMesh } from "./mesh"

export type BallBearingProps = BallBearingModelPropsInput & { color?: string }

export function createBallBearingGeom(input: BallBearingModelPropsInput = {}) {
  return indexedMeshToGeom3(createBallBearingMesh(input))
}

/** Separately colored physical parts retain their individual closed surfaces. */
export function BallBearing({ color, ...props }: BallBearingProps) {
  const { parts } = createBallBearingMesh(props)
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

export { createBallBearingMesh } from "./mesh"
export type {
  BallBearingMesh,
  BallBearingMeshPart,
  BallBearingMeshOptions,
} from "./mesh"
