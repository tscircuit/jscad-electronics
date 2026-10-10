import jscad from "@jscad/modeling"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import {
  pottingBoxModelPropsSchema,
  getPottingBoxDimensions,
  type PottingBoxModelPropsInput,
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

/** Open rectangular potting cup with two pierced floor-level mounting ears. Exact datum and fitting dimensions are owned by modelprinter. */
function buildPottingBoxSolid(input: PottingBoxModelPropsInput) {
  const p = pottingBoxModelPropsSchema.parse(input)
  const epsilon = Math.max(1, ...Object.values(p)) * 1e-3
  const outer = primitives.cuboid({
    size: [p.width, p.depth, p.height],
    center: [0, 0, p.height / 2],
  })
  const cavity = primitives.cuboid({
    size: [
      p.width - 2 * p.wallThickness,
      p.depth - 2 * p.wallThickness,
      p.height - p.floorThickness + epsilon,
    ],
    center: [0, 0, (p.height + p.floorThickness + epsilon) / 2],
  })
  const ears = [-1, 1].map((side) =>
    primitives.cuboid({
      size: [p.earLength, p.earWidth, p.floorThickness],
      center: [(side * (p.width + p.earLength)) / 2, 0, p.floorThickness / 2],
    }),
  )
  const holes = [-1, 1].map((side) =>
    primitives.cylinder({
      radius: p.holeDiameter / 2,
      height: p.floorThickness + 2 * epsilon,
      center: [(side * p.holePitch) / 2, 0, p.floorThickness / 2],
      segments: 64,
    }),
  )
  return booleans.subtract(
    booleans.union(booleans.subtract(outer, cavity), ...ears),
    ...holes,
  )
}
export function createPottingBoxMesh(input: PottingBoxModelPropsInput) {
  const geom = generalize(
    { snap: true, triangulate: true },
    buildPottingBoxSolid(input),
  )
  const p = pottingBoxModelPropsSchema.parse(input)
  const featurePlanes: number[][] = [
    [
      -p.width / 2 - p.earLength,
      -p.width / 2,
      -p.width / 2 + p.wallThickness,
      p.width / 2 - p.wallThickness,
      p.width / 2,
      p.width / 2 + p.earLength,
    ],
    [
      -p.depth / 2,
      -p.depth / 2 + p.wallThickness,
      p.depth / 2 - p.wallThickness,
      p.depth / 2,
      -p.earWidth / 2,
      p.earWidth / 2,
    ],
    [0, p.floorThickness, p.height],
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
export function createPottingBoxGeom(input: PottingBoxModelPropsInput) {
  return indexedMeshToGeom3(createPottingBoxMesh(input))
}
