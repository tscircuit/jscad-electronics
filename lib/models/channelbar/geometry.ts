import jscad from "@jscad/modeling"
import {
  channelBarModelPropsSchema,
  type ChannelBarModelPropsInput,
} from "@tscircuit/modelprinter"
const { primitives, extrusions, geometries, modifiers, measurements } = jscad
// JSCAD's runtime exports a function here; its default-export declaration is a namespace.
const generalize = modifiers.generalize as unknown as (
  options: { snap?: boolean; triangulate?: boolean },
  geometry: jscad.geometries.geom3.Geom3,
) => jscad.geometries.geom3.Geom3

const { rectangle, roundedRectangle, polygon } = primitives

const profile = (shape: jscad.geometries.geom2.Geom2, height: number) =>
  extrusions.extrudeLinear({ height }, shape)
const roundedRect = (width: number, height: number, radius: number) =>
  radius
    ? roundedRectangle({
        size: [width, height],
        roundRadius: radius,
        segments: 64,
      })
    : rectangle({ size: [width, height] })

type Point = [number, number]
function filletProfile(
  points: Point[],
  radii: number[],
  width: number,
  height: number,
) {
  const outline: Point[] = []
  for (let i = 0; i < points.length; i++) {
    const a = points[(i + points.length - 1) % points.length]!
    const b = points[i]!
    const c = points[(i + 1) % points.length]!
    const radius = radii[i]!
    if (!radius) {
      outline.push([b[0] - width / 2, b[1] - height / 2])
      continue
    }
    const al = Math.hypot(a[0] - b[0], a[1] - b[1])
    const cl = Math.hypot(c[0] - b[0], c[1] - b[1])
    const u: Point = [(a[0] - b[0]) / al, (a[1] - b[1]) / al]
    const v: Point = [(c[0] - b[0]) / cl, (c[1] - b[1]) / cl]
    const center: Point = [
      b[0] + radius * (u[0] + v[0]),
      b[1] + radius * (u[1] + v[1]),
    ]
    const start = Math.atan2(
      b[1] + radius * u[1] - center[1],
      b[0] + radius * u[0] - center[0],
    )
    // Positive turns trim convex corners; negative turns fill concave roots.
    const turn = u[1] * v[0] - u[0] * v[1] > 0 ? 1 : -1
    for (let j = 0; j <= 16; j++) {
      const angle = start + (turn * j * Math.PI) / 32
      outline.push([
        center[0] + radius * Math.cos(angle) - width / 2,
        center[1] + radius * Math.sin(angle) - height / 2,
      ])
    }
  }
  return polygon({ points: outline })
}

/** U-section stock centered on XY, opening toward +Y, length along +Z. Root radii and four free-tip radii preserve the outer envelope. */
export function createChannelBarGeom(input: ChannelBarModelPropsInput) {
  const p = channelBarModelPropsSchema.parse(input)
  return profile(
    filletProfile(
      [
        [0, 0],
        [p.width, 0],
        [p.width, p.height],
        [p.width - p.flangeThickness, p.height],
        [p.width - p.flangeThickness, p.webThickness],
        [p.flangeThickness, p.webThickness],
        [p.flangeThickness, p.height],
        [0, p.height],
      ],
      [
        0,
        0,
        p.tipRadius,
        p.tipRadius,
        p.innerRadius,
        p.innerRadius,
        p.tipRadius,
        p.tipRadius,
      ],
      p.width,
      p.height,
    ),
    p.length,
  )
}
export function createChannelBarMesh(input: ChannelBarModelPropsInput) {
  const geom = generalize(
    { snap: true, triangulate: true },
    createChannelBarGeom(input),
  )
  const epsilon = Math.max(...measurements.measureDimensions(geom)) * 1e-10
  const positions: number[] = []
  const indices: number[] = []
  const lookup = new Map<string, number>()
  const vertex = (v: number[]) => {
    const key = v.map((x) => Math.round(x / epsilon)).join(",")
    let index = lookup.get(key)
    if (index === undefined) {
      index = positions.length / 3
      positions.push(...v)
      lookup.set(key, index)
    }
    return index
  }
  for (const poly of geometries.geom3.toPolygons(geom)) {
    for (let i = 1; i < poly.vertices.length - 1; i++) {
      const a = poly.vertices[0]!,
        b = poly.vertices[i]!,
        c = poly.vertices[i + 1]!
      const u = b.map((x, j) => x - a[j]!),
        v = c.map((x, j) => x - a[j]!)
      const area = Math.hypot(
        u[1]! * v[2]! - u[2]! * v[1]!,
        u[2]! * v[0]! - u[0]! * v[2]!,
        u[0]! * v[1]! - u[1]! * v[0]!,
      )
      if (area > epsilon * epsilon)
        indices.push(vertex(a), vertex(b), vertex(c))
    }
  }
  return { positions, indices }
}
