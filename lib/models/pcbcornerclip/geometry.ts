import jscad from "@jscad/modeling"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import {
  pcbCornerClipModelPropsSchema,
  getPcbCornerClipDimensions,
  type PcbCornerClipModelPropsInput,
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

/** PCB corner support with two perpendicular edge grooves and a central base mounting hole. Exact datum and fitting dimensions are owned by modelprinter. */
function buildPcbCornerClipSolid(input: PcbCornerClipModelPropsInput) {
  const p = pcbCornerClipModelPropsSchema.parse(input)
  const epsilon = Math.max(1, ...Object.values(p)) * 1e-3
  const floor = primitives.cuboid({
    size: [p.width, p.depth, p.floorThickness],
    center: [0, 0, p.floorThickness / 2],
  })
  const wallX = primitives.cuboid({
    size: [p.wallThickness, p.depth, p.height - p.floorThickness],
    center: [
      -p.width / 2 + p.wallThickness / 2,
      0,
      (p.height + p.floorThickness) / 2,
    ],
  })
  const wallY = primitives.cuboid({
    size: [p.width, p.wallThickness, p.height - p.floorThickness],
    center: [
      0,
      -p.depth / 2 + p.wallThickness / 2,
      (p.height + p.floorThickness) / 2,
    ],
  })
  const grooveZ = p.slotBottomZ + p.boardThickness / 2
  // A single inside-corner pocket keeps both outside back walls continuous.
  const grooveMinX = -p.width / 2 + p.wallThickness - p.grooveDepth
  const grooveMinY = -p.depth / 2 + p.wallThickness - p.grooveDepth
  const groove = primitives.cuboid({
    size: [
      p.width / 2 - grooveMinX + epsilon,
      p.depth / 2 - grooveMinY + epsilon,
      p.boardThickness,
    ],
    center: [
      (p.width / 2 + epsilon + grooveMinX) / 2,
      (p.depth / 2 + epsilon + grooveMinY) / 2,
      grooveZ,
    ],
  })
  return booleans.subtract(
    booleans.union(floor, wallX, wallY),
    groove,
    primitives.cylinder({
      radius: p.holeDiameter / 2,
      height: p.floorThickness + 2 * epsilon,
      center: [0, 0, p.floorThickness / 2],
      segments: 64,
    }),
  )
}
export function createPcbCornerClipMesh(input: PcbCornerClipModelPropsInput) {
  const geom = generalize(
    { snap: true, triangulate: true },
    buildPcbCornerClipSolid(input),
  )
  const p = pcbCornerClipModelPropsSchema.parse(input)
  const featurePlanes: number[][] = [
    [
      -p.width / 2,
      -p.width / 2 + p.wallThickness - p.grooveDepth,
      -p.width / 2 + p.wallThickness,
      p.width / 2,
    ],
    [
      -p.depth / 2,
      -p.depth / 2 + p.wallThickness - p.grooveDepth,
      -p.depth / 2 + p.wallThickness,
      p.depth / 2,
    ],
    [
      0,
      p.floorThickness,
      p.slotBottomZ,
      p.slotBottomZ + p.boardThickness,
      p.height,
    ],
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
export function createPcbCornerClipGeom(input: PcbCornerClipModelPropsInput) {
  return indexedMeshToGeom3(createPcbCornerClipMesh(input))
}
