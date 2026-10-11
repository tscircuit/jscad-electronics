import {
  perforatedAngleModelPropsSchema,
  type PerforatedAngleModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  circularProfile,
  extrudePlanarProfile,
  joinProfileMeshes,
  type ProfilePoint,
} from "../../mechanical/extrude-planar-profile"
export interface PerforatedAngleMesh {
  positions: number[]
  indices: number[]
}
// Quarter-annulus with exact tangent endpoints, not a sharp-corner substitute.
function quarterBend(radius: number, thickness: number): ProfilePoint[] {
  const outer = radius + thickness
  const center = outer
  const points: ProfilePoint[] = []
  for (let step = 0; step <= 48; step++) {
    const angle = Math.PI + (step * Math.PI) / 96
    points.push(
      step === 0
        ? [0, center]
        : step === 48
          ? [center, 0]
          : [
              center + outer * Math.cos(angle),
              center + outer * Math.sin(angle),
            ],
    )
  }
  if (radius === 0) points.push([center, center])
  else
    for (let step = 0; step <= 48; step++) {
      const angle = (3 * Math.PI) / 2 - (step * Math.PI) / 96
      points.push(
        step === 0
          ? [center, thickness]
          : step === 48
            ? [thickness, center]
            : [
                center + radius * Math.cos(angle),
                center + radius * Math.sin(angle),
              ],
      )
    }
  return points
}
/** Constant-thickness equal or unequal L-section with round holes in both legs. XY envelope is centered; the outside heel is at minimum X/Y and cut ends are Z=0 and Z=length. Inside bend radius is innerRadius; outside radius is innerRadius+thickness. Each leg hole center is legOffset from the outside heel and Z=endOffset+i*pitch. */
export function createPerforatedAngleMesh(
  input: PerforatedAngleModelPropsInput,
): PerforatedAngleMesh {
  const p = perforatedAngleModelPropsSchema.parse(input)
  const {
    width: w,
    height: h,
    thickness: t,
    length: l,
    innerRadius: r,
    holeCount,
    holeDiameter,
    pitch,
    endOffset,
    legOffset,
  } = p
  const tangent = r + t
  const panel = (end: number): ProfilePoint[] => [
    [tangent, 0],
    [end, 0],
    [end, l],
    [tangent, l],
  ]
  const holes = Array.from({ length: holeCount }, (_, i) =>
    circularProfile(legOffset, endOffset + i * pitch, holeDiameter / 2),
  )
  const mesh = joinProfileMeshes([
    extrudePlanarProfile({
      outer: panel(w),
      holes,
      start: 0,
      end: t,
      project: (u, v, d) => [u, d, v],
      reverse: true,
      skipWall: (a, b) => a[0] === tangent && b[0] === tangent,
    }),
    extrudePlanarProfile({
      outer: panel(h),
      holes,
      start: 0,
      end: t,
      project: (u, v, d) => [d, u, v],
      skipWall: (a, b) => a[0] === tangent && b[0] === tangent,
    }),
    extrudePlanarProfile({
      outer: quarterBend(r, t),
      start: 0,
      end: l,
      skipWall: (a, b) =>
        (a[0] === tangent && b[0] === tangent) ||
        (a[1] === tangent && b[1] === tangent),
    }),
  ])
  mesh.positions = mesh.positions.map(
    (value, index) =>
      value - (index % 3 === 0 ? w / 2 : index % 3 === 1 ? h / 2 : 0),
  )
  return mesh
}
