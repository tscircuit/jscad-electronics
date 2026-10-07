import type { ThrustBallBearingModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import {
  createThrustBallBearingMeshParts,
  type ThrustBallBearingMeshOptions,
} from "./mesh"

export type ThrustBallBearingProps = ThrustBallBearingModelPropsInput & {
  color?: string
  cageColor?: string
}

export function createThrustBallBearingGeoms(
  input: ThrustBallBearingModelPropsInput = {},
  options: ThrustBallBearingMeshOptions = {},
) {
  return createThrustBallBearingMeshParts(input, options).map(
    indexedMeshToGeom3,
  )
}

/** Assembled axial bearing with open bore, separate grooved washers and cage. */
export function ThrustBallBearing({
  color = "#aab1bb",
  cageColor = "#b89755",
  ...props
}: ThrustBallBearingProps) {
  return (
    <>
      {createThrustBallBearingMeshParts(props).map((part, index) => (
        <Colorize key={index} color={part.kind === "cage" ? cageColor : color}>
          <Custom geometry={indexedMeshToGeom3(part)} />
        </Colorize>
      ))}
    </>
  )
}

export {
  createThrustBallBearingMesh,
  createThrustBallBearingMeshParts,
} from "./mesh"
export type {
  ThrustBallBearingMesh,
  ThrustBallBearingMeshOptions,
  ThrustBallBearingMeshPart,
} from "./mesh"
