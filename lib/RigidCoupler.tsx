import type { RigidCouplerModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createRigidCouplerMesh } from "./mechanical/rigid-coupler-mesh"
import { indexedMeshToGeom3 } from "./mechanical/indexedMeshToGeom3"

export type RigidCouplerProps = RigidCouplerModelPropsInput & { color?: string }

/** Datum and mounting-hole coordinates follow the modelprinter contract. */
export function createRigidCouplerGeom(input: RigidCouplerModelPropsInput) {
  return indexedMeshToGeom3(createRigidCouplerMesh(input))
}

export function RigidCoupler({
  color = "#737e8f",
  ...props
}: RigidCouplerProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createRigidCouplerGeom(props)} />
    </Colorize>
  )
}
export { createRigidCouplerMesh } from "./mechanical/rigid-coupler-mesh"
export type { RigidCouplerMesh } from "./mechanical/rigid-coupler-mesh"
