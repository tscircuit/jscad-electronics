import type { LeadScrewNutModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createLeadScrewNutMesh, type LeadScrewNutMeshOptions } from "./mesh"
export type LeadScrewNutProps = LeadScrewNutModelPropsInput & { color?: string }
export function createLeadScrewNutGeom(
  input: LeadScrewNutModelPropsInput,
  options?: LeadScrewNutMeshOptions,
) {
  return indexedMeshToGeom3(createLeadScrewNutMesh(input, options))
}
export function LeadScrewNut({
  color = "#b49a55",
  ...props
}: LeadScrewNutProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createLeadScrewNutGeom(props)} />
    </Colorize>
  )
}
export { createLeadScrewNutMesh } from "./mesh"
export type { LeadScrewNutMesh, LeadScrewNutMeshOptions } from "./mesh"
