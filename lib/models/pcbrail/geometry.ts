import jscad from "@jscad/modeling"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import {
  pcbRailModelPropsSchema,
  getPcbRailDimensions,
  type PcbRailModelPropsInput,
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

/** L-section PCB edge rail with a horizontal board groove and pierced mounting tabs at both ends. Exact datum and fitting dimensions are owned by modelprinter. */
function buildPcbRailSolid(input: PcbRailModelPropsInput) {
  const p = pcbRailModelPropsSchema.parse(input)
  const epsilon = Math.max(1, ...Object.values(p)) * 1e-3
  const floor = primitives.cuboid({
    size: [p.length, p.width, p.floorThickness],
    center: [0, 0, p.floorThickness / 2],
  })
  const wall = primitives.cuboid({
    size: [p.length, p.wallThickness, p.height - p.floorThickness],
    center: [
      0,
      -p.width / 2 + p.wallThickness / 2,
      (p.height + p.floorThickness) / 2,
    ],
  })
  const tabs = [-1, 1].map((side) =>
    primitives.cuboid({
      size: [p.tabLength, p.tabWidth, p.floorThickness],
      center: [(side * (p.length + p.tabLength)) / 2, 0, p.floorThickness / 2],
    }),
  )
  const groove = primitives.cuboid({
    size: [p.length + 2 * epsilon, p.slotDepth + epsilon, p.slotWidth],
    center: [
      0,
      -p.width / 2 + p.wallThickness - (p.slotDepth - epsilon) / 2,
      p.slotBottomZ + p.slotWidth / 2,
    ],
  })
  const holes = [-1, 1].map((side) =>
    primitives.cylinder({
      radius: p.holeDiameter / 2,
      height: p.floorThickness + 2 * epsilon,
      center: [(side * p.holePitch) / 2, 0, p.floorThickness / 2],
      segments: 64,
    }),
  )
  return booleans.subtract(
    booleans.union(floor, wall, ...tabs),
    groove,
    ...holes,
  )
}
export function createPcbRailMesh(input: PcbRailModelPropsInput) {
  const geom = generalize(
    { snap: true, triangulate: true },
    buildPcbRailSolid(input),
  )
  const p = pcbRailModelPropsSchema.parse(input)
  const featurePlanes: number[][] = [
    [
      -p.length / 2 - p.tabLength,
      -p.length / 2,
      p.length / 2,
      p.length / 2 + p.tabLength,
    ],
    [
      -p.width / 2,
      -p.width / 2 + p.wallThickness - p.slotDepth,
      -p.width / 2 + p.wallThickness,
      p.width / 2,
      -p.tabWidth / 2,
      p.tabWidth / 2,
    ],
    [0, p.floorThickness, p.slotBottomZ, p.slotBottomZ + p.slotWidth, p.height],
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
export function createPcbRailGeom(input: PcbRailModelPropsInput) {
  return indexedMeshToGeom3(createPcbRailMesh(input))
}
