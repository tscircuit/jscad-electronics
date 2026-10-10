import {
  zeeBarModelPropsSchema,
  type ZeeBarModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  extrudePlanarProfile,
  type ProfilePoint,
} from "../../mechanical/extrude-planar-profile"
export interface ZeeBarMesh {
  positions: number[]
  indices: number[]
}
// Every corner is orthogonal. Concave and convex arcs share bend centers;
// outside radius=inside radius+wall, so material thickness remains constant.
function filletedOutline(
  points: ProfilePoint[],
  radii: number[],
): ProfilePoint[] {
  const outline: ProfilePoint[] = []
  for (let i = 0; i < points.length; i++) {
    const a = points[(i + points.length - 1) % points.length]!,
      b = points[i]!,
      c = points[(i + 1) % points.length]!,
      r = radii[i]!
    if (r === 0) {
      outline.push(b)
      continue
    }
    const al = Math.hypot(a[0] - b[0], a[1] - b[1]),
      cl = Math.hypot(c[0] - b[0], c[1] - b[1])
    const u: ProfilePoint = [(a[0] - b[0]) / al, (a[1] - b[1]) / al],
      v: ProfilePoint = [(c[0] - b[0]) / cl, (c[1] - b[1]) / cl]
    const center: ProfilePoint = [
      b[0] + r * (u[0] + v[0]),
      b[1] + r * (u[1] + v[1]),
    ]
    const start = Math.atan2(
      b[1] + r * u[1] - center[1],
      b[0] + r * u[0] - center[0],
    )
    const turn = u[1] * v[0] - u[0] * v[1] > 0 ? 1 : -1
    for (let step = 0; step <= 48; step++) {
      const angle = start + (turn * step * Math.PI) / 96
      outline.push(
        step === 0
          ? [b[0] + r * u[0], b[1] + r * u[1]]
          : step === 48
            ? [b[0] + r * v[0], b[1] + r * v[1]]
            : [
                center[0] + r * Math.cos(angle),
                center[1] + r * Math.sin(angle),
              ],
      )
    }
  }
  return outline
}
/** Constant-thickness Z-section with lower flange toward -X, upper flange toward +X, and length along +Z from zero. The XY envelope is centered. upperWidth/lowerWidth include the web thickness; total width is upperWidth+lowerWidth-thickness. height is outside-to-outside. bendRadius is the inside radius and outside bends use bendRadius+thickness. */
export function createZeeBarMesh(input: ZeeBarModelPropsInput): ZeeBarMesh {
  const p = zeeBarModelPropsSchema.parse(input)
  const {
    height: h,
    upperWidth: upper,
    lowerWidth: lower,
    thickness: t,
    bendRadius: r,
    length: l,
  } = p
  const w = upper + lower - t,
    outer = r + t
  const outline = filletedOutline(
    [
      [0, 0],
      [lower, 0],
      [lower, h - t],
      [w, h - t],
      [w, h],
      [lower - t, h],
      [lower - t, t],
      [0, t],
    ],
    [0, outer, r, 0, 0, outer, r, 0],
  ).map(([x, y]) => [x - w / 2, y - h / 2] as ProfilePoint)
  return extrudePlanarProfile({ outer: outline, start: 0, end: l })
}
