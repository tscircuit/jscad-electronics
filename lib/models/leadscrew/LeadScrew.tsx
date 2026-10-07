import type { LeadScrewModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createLeadScrewMesh, type LeadScrewMeshOptions } from "./mesh"
export type LeadScrewProps = LeadScrewModelPropsInput & { color?: string }
export function createLeadScrewGeom(
  input: LeadScrewModelPropsInput,
  options?: LeadScrewMeshOptions,
) {
  return indexedMeshToGeom3(createLeadScrewMesh(input, options))
}
export function LeadScrew({ color = "#85909e", ...props }: LeadScrewProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createLeadScrewGeom(props)} />
    </Colorize>
  )
}
export { createLeadScrewMesh } from "./mesh"
export type { LeadScrewMesh, LeadScrewMeshOptions } from "./mesh"
