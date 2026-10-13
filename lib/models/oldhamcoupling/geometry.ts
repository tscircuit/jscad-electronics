import jscad from "@jscad/modeling"
import {
  oldhamCouplingModelPropsSchema,
  getOldhamCouplingDimensions,
  type OldhamCouplingModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
const { primitives, booleans } = jscad
/** Actual orthogonal face slots and center-disk tongues, separated by the configured sliding clearance. */
export function createOldhamCouplingParts(
  input: OldhamCouplingModelPropsInput = {},
) {
  const p = oldhamCouplingModelPropsSchema.parse(input)
  const d = getOldhamCouplingDimensions(p)
  const epsilon = Math.min(p.hubLength, d.diskThickness, p.slotDepth) * 1e-4
  const bore = primitives.cylinder({
    radius: p.boreDiameter / 2,
    height: p.length + 2,
    center: [0, 0, p.length / 2],
    segments: 64,
  })
  const hub = (z: number) =>
    primitives.cylinder({
      radius: p.outerDiameter / 2,
      height: p.hubLength,
      center: [0, 0, z + p.hubLength / 2],
      segments: 64,
    })
  const lowerSlot = primitives.cuboid({
    size: [p.outerDiameter + 2, p.slotWidth, p.slotDepth + epsilon],
    center: [0, 0, p.hubLength - p.slotDepth / 2 + epsilon / 2],
  })
  const upperSlot = primitives.cuboid({
    size: [p.slotWidth, p.outerDiameter + 2, p.slotDepth + epsilon],
    center: [0, 0, p.length - p.hubLength + p.slotDepth / 2 - epsilon / 2],
  })
  const hubs = booleans.subtract(
    booleans.union(
      booleans.subtract(hub(0), lowerSlot),
      booleans.subtract(hub(p.length - p.hubLength), upperSlot),
    ),
    bore,
  )
  const bottom = p.hubLength + p.clearance,
    top = p.length - p.hubLength - p.clearance
  const diskBlank = primitives.cylinder({
    radius: d.diskDiameter / 2,
    height: d.diskThickness,
    center: [0, 0, p.length / 2],
    segments: 64,
  })
  const lowerTongue = primitives.cuboid({
    size: [d.diskDiameter * 0.88, d.tongueWidth, d.tongueHeight + epsilon],
    center: [0, 0, bottom - d.tongueHeight / 2 + epsilon / 2],
  })
  const upperTongue = primitives.cuboid({
    size: [d.tongueWidth, d.diskDiameter * 0.88, d.tongueHeight + epsilon],
    center: [0, 0, top + d.tongueHeight / 2 - epsilon / 2],
  })
  return {
    hubs,
    disk: booleans.subtract(
      booleans.union(diskBlank, lowerTongue, upperTongue),
      bore,
    ),
  }
}
export function createOldhamCouplingGeom(
  input: OldhamCouplingModelPropsInput = {},
) {
  const parts = createOldhamCouplingParts(input)
  return booleans.union(parts.hubs, parts.disk)
}
export function createOldhamCouplingMesh(
  input: OldhamCouplingModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createOldhamCouplingGeom(input))
}
