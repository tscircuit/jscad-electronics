import { finishShaftMountMesh } from "../../mechanical/shaft-mount-geometry"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import jscad from "@jscad/modeling"
import {
  edgeGrommetModelPropsSchema,
  type EdgeGrommetModelPropsInput,
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
function createEdgeGrommetSolid(input: EdgeGrommetModelPropsInput) {
  const p = edgeGrommetModelPropsSchema.parse(input)
  const outer = p.cornerRadius
    ? primitives.roundedRectangle({
        size: [p.width, p.height],
        roundRadius: p.cornerRadius,
        segments: 64,
      })
    : primitives.rectangle({ size: [p.width, p.height] })
  const shifted = transforms.translate([0, p.height / 2], outer)
  const slot = primitives.rectangle({
    size: [p.slotWidth, p.slotDepth + 1],
    center: [0, (p.slotDepth - 1) / 2],
  })
  const profile = booleans.subtract(shifted, slot)
  const extrusion = extrusions.extrudeLinear({ height: p.length }, profile)
  // Local (u,v,depth) becomes global (X,Y,Z)=(depth,u,v), an orientation-preserving permutation.
  return transforms.translate(
    [-p.length / 2, 0, 0],
    transforms.rotateX(Math.PI / 2, transforms.rotateY(Math.PI / 2, extrusion)),
  )
}
export function createEdgeGrommetMesh(input: EdgeGrommetModelPropsInput) {
  const p = edgeGrommetModelPropsSchema.parse(input)
  const planes: number[][] = [
    [-p.length / 2, p.length / 2],
    [-p.width / 2, -p.slotWidth / 2, p.slotWidth / 2, p.width / 2],
    [0, p.slotDepth, p.height],
  ]
  const geom = createEdgeGrommetSolid(p)
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
export function createEdgeGrommetGeom(input: EdgeGrommetModelPropsInput) {
  return indexedMeshToGeom3(createEdgeGrommetMesh(input))
}
