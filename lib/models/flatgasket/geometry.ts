import {
  flatGasketModelPropsSchema,
  getFlatGasketDimensions,
  type FlatGasketModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  extrudePlanarProfile,
  circularProfile,
  type ProfilePoint,
} from "../../mechanical/extrude-planar-profile"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"

export interface FlatGasketMesh {
  positions: number[]
  indices: number[]
}
/** Flat annular seal centered on XY. The mating face is Z=0 and the opposite face is Z=thickness. Both bore and outside walls are straight, with no bevels. Custom dimensions specify nominal geometry without material or compression properties. */
export function createFlatGasketMesh(
  input: FlatGasketModelPropsInput,
): FlatGasketMesh {
  const p = flatGasketModelPropsSchema.parse(input),
    d = getFlatGasketDimensions(p)
  if (Math.min(p.thickness, d.radialWidth) <= Math.max(...d.size) * 1e-10)
    throw new Error("flatgasket dimensions exceed mesh resolution limits")
  return extrudePlanarProfile({
    outer: circularProfile(0, 0, p.outerDiameter / 2, 128),
    holes: [circularProfile(0, 0, p.innerDiameter / 2, 128)],
    start: d.bottomZ,
    end: d.topZ,
  })
}
export function createFlatGasketGeom(input: FlatGasketModelPropsInput) {
  return indexedMeshToGeom3(createFlatGasketMesh(input))
}
