import {
  tSlotInsideCornerModelPropsSchema,
  type TSlotInsideCornerModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  circularProfile,
  extrudePlanarProfile,
  joinProfileMeshes,
  type ProfilePoint,
} from "./extrude-planar-profile"

export interface TSlotInsideCornerMesh {
  positions: number[]
  indices: number[]
}

/** Constant-thickness quarter bend joining two perpendicular drilled legs.
 * Virtual inside corner is X=Z=0; width is centered on Y. No internal seam caps.
 */
export function createTSlotInsideCornerMesh(
  input: TSlotInsideCornerModelPropsInput = {},
): TSlotInsideCornerMesh {
  const props = tSlotInsideCornerModelPropsSchema.parse(input)
  const { width, legLength, thickness, bendRadius, holeOffset, holeDiameter } =
    props
  const r = bendRadius
  const outerRadius = r + thickness
  const panel: ProfilePoint[] = [
    [r, -width / 2],
    [legLength, -width / 2],
    [legLength, width / 2],
    [r, width / 2],
  ]
  const holes = [circularProfile(holeOffset, 0, holeDiameter / 2)]
  const bend: ProfilePoint[] = []
  if (r === 0) bend.push([0, 0])
  else
    for (let step = 0; step <= 48; step++) {
      const angle = -Math.PI / 2 - (step * Math.PI) / 96
      bend.push(
        step === 0
          ? [r, 0]
          : step === 48
            ? [0, r]
            : [r + r * Math.cos(angle), r + r * Math.sin(angle)],
      )
    }
  for (let step = 0; step <= 48; step++) {
    const angle = -Math.PI + (step * Math.PI) / 96
    bend.push(
      step === 0
        ? [-thickness, r]
        : step === 48
          ? [r, -thickness]
          : [
              r + outerRadius * Math.cos(angle),
              r + outerRadius * Math.sin(angle),
            ],
    )
  }
  return joinProfileMeshes([
    extrudePlanarProfile({
      outer: panel,
      holes,
      start: -thickness,
      end: 0,
      skipWall: (a, b) => a[0] === r && b[0] === r,
    }),
    extrudePlanarProfile({
      outer: panel,
      holes,
      start: -thickness,
      end: 0,
      project: (u, v, depth) => [depth, v, u],
      reverse: true,
      skipWall: (a, b) => a[0] === r && b[0] === r,
    }),
    extrudePlanarProfile({
      outer: bend,
      start: -width / 2,
      end: width / 2,
      project: (u, v, depth) => [u, depth, v],
      reverse: true,
      skipWall: (a, b) =>
        (a[0] === r && b[0] === r) || (a[1] === r && b[1] === r),
    }),
  ])
}
