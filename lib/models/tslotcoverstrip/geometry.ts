import jscad from "@jscad/modeling"
import {
  tSlotCoverStripModelPropsSchema,
  type TSlotCoverStripModelPropsInput,
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

/** A continuous T-section groove cover: a broad top strip, narrow insertion stem, and wider rectangular retention bead at the stem tip. Length runs along +Z from Z=0. The cover underside mates at Y=0, its top is Y=thickness, and its inserted tip is Y=-stemHeight. barbHeight defaults to 0.5mm and is included in stemHeight. _tee is the value-free profile flag; _profile(tee) is accepted as the roadmap alias. */
export function createTSlotCoverStripGeom(
  input: TSlotCoverStripModelPropsInput,
) {
  const p = tSlotCoverStripModelPropsSchema.parse(input)
  const w = p.width / 2
  const s = p.stemWidth / 2
  const b = p.barbWidth / 2
  const tip = -p.stemHeight
  const beadTop = tip + p.barbHeight
  const outline = primitives.polygon({
    points: [
      [-w, 0],
      [-s, 0],
      [-s, beadTop],
      [-b, beadTop],
      [-b, tip],
      [b, tip],
      [b, beadTop],
      [s, beadTop],
      [s, 0],
      [w, 0],
      [w, p.thickness],
      [-w, p.thickness],
    ],
  })
  return extrusions.extrudeLinear({ height: p.length }, outline)
}

/** Weld and triangulate the closed JSCAD solid without changing its datum. */
export function createTSlotCoverStripMesh(
  input: TSlotCoverStripModelPropsInput,
) {
  const geom = generalize(
    { snap: false, triangulate: true },
    createTSlotCoverStripGeom(input),
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
