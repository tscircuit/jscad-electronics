import jscad from "@jscad/modeling"
import {
  perforatedSheetModelPropsSchema,
  type PerforatedSheetModelPropsInput,
  type PerforatedSheetModelProps,
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

function perforated(p: PerforatedSheetModelProps) {
  const holes = []
  const rows = Math.floor((p.width - 2 * p.edgeY) / p.pitchY + 1 + 1e-10)
  const cols = Math.floor((p.length - 2 * p.edgeX) / p.pitchX + 1 + 1e-10)
  for (let row = 0; row < rows; row++)
    for (let col = 0; col < cols; col++) {
      const x = p.edgeX + col * p.pitchX + (row % 2 ? p.stagger : 0)
      if (x > p.length - p.edgeX + 1e-10) continue
      holes.push(
        circle({
          radius: p.holeDiameter / 2,
          segments: 48,
          center: [x - p.length / 2, p.edgeY + row * p.pitchY - p.width / 2],
        }),
      )
    }
  return profile(
    subtract(rectangle({ size: [p.length, p.width] }), ...holes),
    p.thickness,
  )
}

/** Flat XY panel, bottom Z=0. Hole centers begin edgeX/edgeY from the negative edges, continue on stated pitches while respecting both opposite margins. Odd rows shift +stagger; incomplete edge holes are omitted. At most 2500 holes. */
export function createPerforatedSheetGeom(
  input: PerforatedSheetModelPropsInput,
) {
  const p = perforatedSheetModelPropsSchema.parse(input)
  return perforated(p)
}
export function createPerforatedSheetMesh(
  input: PerforatedSheetModelPropsInput,
) {
  const geom = generalize(
    { snap: true, triangulate: true },
    createPerforatedSheetGeom(input),
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
