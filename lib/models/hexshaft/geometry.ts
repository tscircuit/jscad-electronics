import jscad from "@jscad/modeling"
import {
  hexShaftModelPropsSchema,
  type HexShaftModelPropsInput,
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

/** A regular hexagonal drive shaft with 45-degree chamfers on all six facets at each end. Length runs along the centered +Z axis from Z=0. acrossFlats measures the distance between the flats X=+-acrossFlats/2; vertices lie on the +/-Y axis. endChamfer offsets each flat inward by that amount over the same axial distance. _regularhex is the value-free profile flag; _profile(regularhex) is the roadmap alias. */
export function createHexShaftGeom(input: HexShaftModelPropsInput) {
  const p = hexShaftModelPropsSchema.parse(input)
  const c = p.endChamfer
  const ring = (af: number, z: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const angle = Math.PI / 6 + (i * Math.PI) / 3
      return [
        (af / Math.sqrt(3)) * Math.cos(angle),
        (af / Math.sqrt(3)) * Math.sin(angle),
        z,
      ] as [number, number, number]
    })
  const rings =
    c === 0
      ? [ring(p.acrossFlats, 0), ring(p.acrossFlats, p.length)]
      : [
          ring(p.acrossFlats - 2 * c, 0),
          ring(p.acrossFlats, c),
          ring(p.acrossFlats, p.length - c),
          ring(p.acrossFlats - 2 * c, p.length),
        ]
  const faces: [number, number, number][][] = [
    rings[0]!.slice().reverse(),
    rings[rings.length - 1]!,
  ]
  for (let row = 0; row < rings.length - 1; row++) {
    const lower = rings[row]!
    const upper = rings[row + 1]!
    for (let i = 0; i < 6; i++) {
      const next = (i + 1) % 6
      faces.push([lower[i]!, lower[next]!, upper[next]!, upper[i]!])
    }
  }
  return geometries.geom3.fromPoints(faces)
}

/** Weld and triangulate the closed JSCAD solid without changing its datum. */
export function createHexShaftMesh(input: HexShaftModelPropsInput) {
  const geom = generalize(
    { snap: false, triangulate: true },
    createHexShaftGeom(input),
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
