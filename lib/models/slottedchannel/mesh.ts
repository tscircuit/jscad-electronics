import {
  slottedChannelModelPropsSchema,
  type SlottedChannelModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  circularProfile,
  extrudePlanarProfile,
  joinProfileMeshes,
  type ProfilePoint,
} from "../../mechanical/extrude-planar-profile"
export interface SlottedChannelMesh {
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
/** Overall length includes both semicircular ends; long axis is Z. */
function obround(
  center: number,
  width: number,
  length: number,
): ProfilePoint[] {
  if (length === width) return circularProfile(0, center, width / 2)
  const r = width / 2,
    straight = (length - width) / 2
  const points: ProfilePoint[] = []
  for (let step = 0; step <= 48; step++) {
    const angle = (step * Math.PI) / 48
    points.push([r * Math.cos(angle), center + straight + r * Math.sin(angle)])
  }
  for (let step = 0; step <= 48; step++) {
    const angle = Math.PI + (step * Math.PI) / 48
    points.push([r * Math.cos(angle), center - straight + r * Math.sin(angle)])
  }
  return points
}
/** Constant-thickness open U-section centered on XY, with its outside web at minimum Y, its opening toward +Y, and cut ends Z=0 and Z=length. Inside radius is innerRadius and outside radius is innerRadius+thickness. Through-web slots have semicircular ends, center X=0, long axis Z, and centers Z=endOffset+i*pitch. slotLength is the overall length including the two round ends. */
export function createSlottedChannelMesh(
  input: SlottedChannelModelPropsInput,
): SlottedChannelMesh {
  const p = slottedChannelModelPropsSchema.parse(input)
  const {
    width: w,
    height: h,
    thickness: t,
    length: l,
    innerRadius: r,
    slotCount,
    slotWidth,
    slotLength,
    pitch,
    endOffset,
  } = p
  const tangent = r + t
  const holes = Array.from({ length: slotCount }, (_, i) =>
    obround(endOffset + i * pitch, slotWidth, slotLength),
  )
  const leg: ProfilePoint[] = [
    [tangent, 0],
    [h, 0],
    [h, l],
    [tangent, l],
  ]
  const bend = quarterBend(r, t)
  const mesh = joinProfileMeshes([
    extrudePlanarProfile({
      outer: [
        [tangent, 0],
        [w - tangent, 0],
        [w - tangent, l],
        [tangent, l],
      ],
      holes: holes.map((loop) =>
        loop.map(([u, v]) => [u + w / 2, v] as ProfilePoint),
      ),
      start: 0,
      end: t,
      project: (u, v, d) => [u, d, v],
      reverse: true,
      skipWall: (a, b) =>
        (a[0] === tangent && b[0] === tangent) ||
        (a[0] === w - tangent && b[0] === w - tangent),
    }),
    extrudePlanarProfile({
      outer: leg,
      start: 0,
      end: t,
      project: (u, v, d) => [d, u, v],
      skipWall: (a, b) => a[0] === tangent && b[0] === tangent,
    }),
    extrudePlanarProfile({
      outer: leg,
      start: w - t,
      end: w,
      project: (u, v, d) => [d, u, v],
      skipWall: (a, b) => a[0] === tangent && b[0] === tangent,
    }),
    extrudePlanarProfile({
      outer: bend,
      start: 0,
      end: l,
      skipWall: (a, b) =>
        (a[0] === tangent && b[0] === tangent) ||
        (a[1] === tangent && b[1] === tangent),
    }),
    extrudePlanarProfile({
      outer: bend.map(([u, v]) => [w - u, v]),
      start: 0,
      end: l,
      skipWall: (a, b) =>
        (a[0] === w - tangent && b[0] === w - tangent) ||
        (a[1] === tangent && b[1] === tangent),
    }),
  ])
  mesh.positions = mesh.positions.map(
    (value, index) =>
      value - (index % 3 === 0 ? w / 2 : index % 3 === 1 ? h / 2 : 0),
  )
  return mesh
}
