import jscad from "@jscad/modeling"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import {
  cableTieBaseModelPropsSchema,
  getCableTieBaseDimensions,
  type CableTieBaseModelPropsInput,
} from "@tscircuit/modelprinter"
const {
  primitives,
  booleans,
  transforms,
  extrusions,
  geometries,
  modifiers,
  measurements,
} = jscad
// The JSCAD runtime exports this function, but its declaration models a namespace.
const generalize = modifiers.generalize as unknown as (
  options: { snap?: boolean; triangulate?: boolean },
  geometry: jscad.geometries.geom3.Geom3,
) => jscad.geometries.geom3.Geom3

/** Screw-mounted cable-tie anchor with two perpendicular rectangular tie tunnels. Exact datum and fitting dimensions are owned by modelprinter. */
function buildCableTieBaseSolid(input: CableTieBaseModelPropsInput) {
  const p = cableTieBaseModelPropsSchema.parse(input)
  const epsilon = Math.max(1, ...Object.values(p)) * 1e-3
  const blank = primitives.cuboid({
    size: [p.width, p.depth, p.height],
    center: [0, 0, p.height / 2],
  })
  const tunnelZ = p.floorThickness + p.slotHeight / 2
  return booleans.subtract(
    blank,
    primitives.cuboid({
      size: [p.width + 2 * epsilon, p.slotWidth, p.slotHeight],
      center: [0, 0, tunnelZ],
    }),
    primitives.cuboid({
      size: [p.slotWidth, p.depth + 2 * epsilon, p.slotHeight],
      center: [0, 0, tunnelZ],
    }),
    primitives.cylinder({
      radius: p.holeDiameter / 2,
      height: p.height + 2 * epsilon,
      center: [0, 0, p.height / 2],
      segments: 64,
    }),
  )
}
export function createCableTieBaseMesh(input: CableTieBaseModelPropsInput) {
  const geom = generalize(
    { snap: true, triangulate: true },
    buildCableTieBaseSolid(input),
  )
  const p = cableTieBaseModelPropsSchema.parse(input)
  const featurePlanes: number[][] = [
    [-p.width / 2, p.width / 2, -p.slotWidth / 2, p.slotWidth / 2],
    [-p.depth / 2, p.depth / 2, -p.slotWidth / 2, p.slotWidth / 2],
    [0, p.floorThickness, p.floorThickness + p.slotHeight, p.height],
  ]
  // Generalization snaps CSG vertices before inserting T junctions. Restore
  // each axis-aligned contract plane so its fitting dimensions stay nominal.
  const snapDistance = Math.max(...measurements.measureDimensions(geom)) * 1e-5
  const epsilon = Math.max(...measurements.measureDimensions(geom)) * 1e-10
  const positions: number[] = []
  const indices: number[] = []
  const lookup = new Map<string, number>()
  const vertex = (source: number[]) => {
    const v = source.map((value, axis) => {
      const closest = featurePlanes[axis]!.reduce((a, b) =>
        Math.abs(value - a) < Math.abs(value - b) ? a : b,
      )
      return Math.abs(value - closest) <= snapDistance ? closest : value
    })
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

/** Conforming closed triangles preserve mounting holes in React and vanilla. */
export function createCableTieBaseGeom(input: CableTieBaseModelPropsInput) {
  return indexedMeshToGeom3(createCableTieBaseMesh(input))
}
