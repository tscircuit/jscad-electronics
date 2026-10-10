import {
  keyWasherModelPropsSchema,
  getKeyWasherDimensions,
  type KeyWasherModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  extrudePlanarProfile,
  circularProfile,
  type ProfilePoint,
} from "../../mechanical/extrude-planar-profile"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"

export interface KeyWasherMesh {
  positions: number[]
  indices: number[]
}
/** Custom annular key washer centered on XY, bottom Z=0 and top Z=thickness. One rectangular tab on +X projects inward from the nominal circular bore to X=innerDiameter/2-tabLength. Tab width is along Y and the tab root overlaps the annular body. tabLength is measured radially at the tab centerline. No supplier standard is claimed. */
export function createKeyWasherMesh(
  input: KeyWasherModelPropsInput,
): KeyWasherMesh {
  const p = keyWasherModelPropsSchema.parse(input),
    d = getKeyWasherDimensions(p)
  if (
    Math.min(
      p.thickness,
      p.tabWidth,
      p.tabLength,
      (p.outerDiameter - p.innerDiameter) / 2,
    ) <=
    Math.max(...d.size) * 1e-10
  )
    throw new Error("keywasher dimensions exceed mesh resolution limits")
  const radius = p.innerDiameter / 2
  const alpha = Math.asin(p.tabWidth / (2 * radius))
  const corners = [
    alpha,
    Math.PI / 2,
    Math.PI,
    (3 * Math.PI) / 2,
    2 * Math.PI - alpha,
  ]
  const hole: ProfilePoint[] = []
  for (let arc = 0; arc < 4; arc++)
    for (let i = 0; i < 32; i++) {
      const angle =
        corners[arc]! + ((corners[arc + 1]! - corners[arc]!) * i) / 32
      hole.push([radius * Math.cos(angle), radius * Math.sin(angle)])
    }
  hole[0] = [d.tabRootX, d.tabMaxY]
  hole.push(
    [d.tabRootX, d.tabMinY],
    [d.tabTipX, d.tabMinY],
    [d.tabTipX, d.tabMaxY],
  )
  return extrudePlanarProfile({
    outer: circularProfile(0, 0, p.outerDiameter / 2, 128),
    holes: [hole],
    start: d.bottomZ,
    end: d.topZ,
  })
}
export function createKeyWasherGeom(input: KeyWasherModelPropsInput) {
  return indexedMeshToGeom3(createKeyWasherMesh(input))
}
