import type { BallTransferUnitModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createBallTransferUnitMesh } from "./mesh"

export type BallTransferUnitProps = BallTransferUnitModelPropsInput & {
  color?: string
}

export function createBallTransferUnitGeom(
  input: BallTransferUnitModelPropsInput = {},
) {
  return indexedMeshToGeom3(createBallTransferUnitMesh(input))
}

export function BallTransferUnit({ color, ...props }: BallTransferUnitProps) {
  const { parts } = createBallTransferUnitMesh(props)
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
