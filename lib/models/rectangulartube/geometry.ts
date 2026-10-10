import jscad from "@jscad/modeling"
import {
  rectangularTubeModelPropsSchema,
  type RectangularTubeModelPropsInput,
} from "@tscircuit/modelprinter"
const {
  booleans,
  primitives,
  extrusions,
  geometries,
  modifiers,
  measurements,
} = jscad
// JSCAD's runtime exports a function here; its default-export declaration is a namespace.
const generalize = modifiers.generalize as unknown as (
  options: { snap?: boolean; triangulate?: boolean },
  geometry: jscad.geometries.geom3.Geom3,
) => jscad.geometries.geom3.Geom3
const { subtract } = booleans
const { rectangle, roundedRectangle } = primitives

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

/** Open rectangular stock tube. Outer and inner radii are independent; minimum corner clearance is validated. Section centered on XY, ends Z=0 and Z=length. */
export function createRectangularTubeGeom(
  input: RectangularTubeModelPropsInput,
) {
  const p = rectangularTubeModelPropsSchema.parse(input)
  return profile(
    subtract(
      roundedRect(p.width, p.height, p.outerRadius),
      roundedRect(
        p.width - 2 * p.wallThickness,
        p.height - 2 * p.wallThickness,
        p.innerRadius,
      ),
    ),
    p.length,
  )
}
export function createRectangularTubeMesh(
  input: RectangularTubeModelPropsInput,
) {
  const geom = generalize(
    { snap: true, triangulate: true },
    createRectangularTubeGeom(input),
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
