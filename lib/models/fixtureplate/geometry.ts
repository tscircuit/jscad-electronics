import jscad from "@jscad/modeling"
import {
  fixturePlateModelPropsSchema,
  type FixturePlateModelPropsInput,
  type FixturePlateModelProps,
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
const { rectangle, roundedRectangle, circle } = primitives

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

function fixture(p: FixturePlateModelProps) {
  const holes = []
  for (let row = 0; row < p.rows; row++)
    for (let col = 0; col < p.columns; col++)
      holes.push(
        circle({
          radius: p.holeDiameter / 2,
          segments: 48,
          center: [
            p.edgeX + col * p.pitch - p.length / 2,
            p.edgeY + row * p.pitch - p.width / 2,
          ],
        }),
      )
  return profile(
    subtract(rectangle({ size: [p.length, p.width] }), ...holes),
    p.thickness,
  )
}

/** XY workholding plate with an explicitly located rectangular grid of plain through-holes. Counts, pitch and first-hole margins are independent; the grid must remain inside the plate. Bottom Z=0; no threads or counterbores implied. */
export function createFixturePlateGeom(input: FixturePlateModelPropsInput) {
  const p = fixturePlateModelPropsSchema.parse(input)
  return fixture(p)
}
export function createFixturePlateMesh(input: FixturePlateModelPropsInput) {
  const geom = generalize(
    { snap: true, triangulate: true },
    createFixturePlateGeom(input),
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
