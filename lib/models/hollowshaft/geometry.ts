import jscad from "@jscad/modeling"
import {
  hollowShaftModelPropsSchema,
  type HollowShaftModelPropsInput,
} from "@tscircuit/modelprinter"
const {
  primitives,
  extrusions,
  booleans,
  geometries,
  modifiers,
  measurements,
} = jscad
// JSCAD's runtime function is declared as a namespace on its default export.
const generalize = modifiers.generalize as unknown as (
  options: { snap?: boolean; triangulate?: boolean },
  geometry: jscad.geometries.geom3.Geom3,
) => jscad.geometries.geom3.Geom3

/** A concentric round tubular drive shaft with a through bore and 45-degree chamfers on both the inner and outer edges of both ends. The centered shaft axis is +Z and bottom face Z=0. endChamfer is the radial and axial chamfer size; validation preserves a positive annular end land. _roundtube is the value-free style flag; _style(roundtube) is accepted as the roadmap alias. */
export function createHollowShaftGeom(input: HollowShaftModelPropsInput) {
  const p = hollowShaftModelPropsSchema.parse(input)
  const ro = p.outerDiameter / 2
  const ri = p.innerDiameter / 2
  const c = p.endChamfer
  // Keep the nominal bore circle clear between every pair of polygon vertices.
  // Increase resolution for narrow end lands rather than cutting across them.
  let segments = 128
  while ((ro - c) * Math.cos(Math.PI / segments) <= ri + c && segments < 4096)
    segments *= 2
  if ((ro - c) * Math.cos(Math.PI / segments) <= ri + c)
    throw new Error(
      "Annular end land is too narrow for the bounded circular tessellation",
    )
  const boreScale = 1 / Math.cos(Math.PI / segments)
  const profile: [number, number][] =
    c === 0
      ? [
          [ri * boreScale, 0],
          [ro, 0],
          [ro, p.length],
          [ri * boreScale, p.length],
        ]
      : [
          [(ri + c) * boreScale, 0],
          [ro - c, 0],
          [ro, c],
          [ro, p.length - c],
          [ro - c, p.length],
          [(ri + c) * boreScale, p.length],
          [ri * boreScale, p.length - c],
          [ri * boreScale, c],
        ]
  return extrusions.extrudeRotate(
    { segments },
    primitives.polygon({ points: profile }),
  )
}

/** Weld and triangulate the closed JSCAD solid without changing its datum. */
export function createHollowShaftMesh(input: HollowShaftModelPropsInput) {
  const geom = generalize(
    { snap: false, triangulate: true },
    createHollowShaftGeom(input),
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
