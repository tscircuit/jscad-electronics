import {
  adhesiveMountElectricalComponentHeatsinkModelPropsSchema,
  getAdhesiveMountElectricalComponentHeatsinkDimensions,
  type AdhesiveMountElectricalComponentHeatsinkModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  extrudePlanarProfile,
  type ProfilePoint,
} from "../../mechanical/extrude-planar-profile"
export interface AdhesiveMountElectricalComponentHeatsinkMesh {
  positions: number[]
  indices: number[]
}
/** One closed comb extrusion; no coplanar overlaps between fins and base. */
export function createAdhesiveMountElectricalComponentHeatsinkMesh(
  input: AdhesiveMountElectricalComponentHeatsinkModelPropsInput,
): AdhesiveMountElectricalComponentHeatsinkMesh {
  const p =
      adhesiveMountElectricalComponentHeatsinkModelPropsSchema.parse(input),
    d = getAdhesiveMountElectricalComponentHeatsinkDimensions(p)
  const scale = Math.max(p.width, p.length, p.height)
  if (
    Math.min(
      p.baseThickness,
      p.finThickness,
      d.finHeight,
      d.finGap,
      p.length,
    ) <=
    scale * 1e-10
  )
    throw new Error("Heatsink exceeds mesh resolution limits")
  const left = -p.width / 2,
    right = p.width / 2
  const profile: ProfilePoint[] = [
    [left, 0],
    [right, 0],
  ]
  for (let fin = p.finCount - 1; fin >= 0; fin--) {
    const x = left + fin * d.finPitch
    profile.push(
      [fin === p.finCount - 1 ? right : x + p.finThickness, p.height],
      [x, p.height],
    )
    if (fin > 0)
      profile.push(
        [x, p.baseThickness],
        [left + (fin - 1) * d.finPitch + p.finThickness, p.baseThickness],
      )
  }
  return extrudePlanarProfile({
    outer: profile,
    start: -p.length / 2,
    end: p.length / 2,
    project: (x, z, y) => [x, y, z],
    reverse: true,
  })
}
