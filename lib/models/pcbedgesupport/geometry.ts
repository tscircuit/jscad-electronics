import { finishShaftMountMesh } from "../../mechanical/shaft-mount-geometry"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import jscad from "@jscad/modeling"
import {
  pcbEdgeSupportModelPropsSchema,
  type PcbEdgeSupportModelPropsInput,
} from "@tscircuit/modelprinter"
const {
  primitives,
  extrusions,
  transforms,
  booleans,
  geometries,
  measurements,
} = jscad
/** Custom nominal fitting geometry with the modelprinter contract's explicit datum. */
function createPcbEdgeSupportSolid(input: PcbEdgeSupportModelPropsInput) {
  const p = pcbEdgeSupportModelPropsSchema.parse(input)
  const base = primitives.cuboid({
    size: [p.width, p.depth, p.baseThickness],
    center: [0, 0, p.baseThickness / 2],
  })
  const body = primitives.cuboid({
    size: [p.bodyWidth, p.depth, p.height],
    center: [0, 0, p.height / 2],
  })
  const slot = primitives.cuboid({
    size: [p.bodyWidth + 2, p.slotWidth, p.slotDepth + 1],
    center: [0, 0, p.height - p.slotDepth / 2 + 0.5],
  })
  const bores = [-1, 1].map((sign) =>
    primitives.cylinder({
      radius: p.holeDiameter / 2,
      height: p.baseThickness + 2,
      center: [(sign * p.holePitch) / 2, 0, p.baseThickness / 2],
      segments: 96,
    }),
  )
  return booleans.subtract(booleans.union(base, body), slot, ...bores)
}
export function createPcbEdgeSupportMesh(input: PcbEdgeSupportModelPropsInput) {
  const p = pcbEdgeSupportModelPropsSchema.parse(input)
  const planes: number[][] = [
    [-p.width / 2, -p.bodyWidth / 2, p.bodyWidth / 2, p.width / 2],
    [-p.depth / 2, -p.slotWidth / 2, p.slotWidth / 2, p.depth / 2],
    [0, p.baseThickness, p.height - p.slotDepth, p.height],
  ]
  const geom = createPcbEdgeSupportSolid(p)
  const tolerance = Math.max(...measurements.measureDimensions(geom)) * 1e-5
  // Retain explicit flat fitting planes after JSCAD's planar quantization.
  const polygons = geometries.geom3.toPolygons(geom).map((poly) =>
    poly.vertices.map(
      (point) =>
        point.map((value, axis) => {
          const nearest = planes[axis]!.reduce((a, b) =>
            Math.abs(a - value) < Math.abs(b - value) ? a : b,
          )
          return Math.abs(nearest - value) < tolerance ? nearest : value
        }) as [number, number, number],
    ),
  )
  return finishShaftMountMesh(geometries.geom3.fromPoints(polygons))
}
export function createPcbEdgeSupportGeom(input: PcbEdgeSupportModelPropsInput) {
  return indexedMeshToGeom3(createPcbEdgeSupportMesh(input))
}
