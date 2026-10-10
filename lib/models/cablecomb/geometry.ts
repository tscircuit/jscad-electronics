import { finishShaftMountMesh } from "../../mechanical/shaft-mount-geometry"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import jscad from "@jscad/modeling"
import {
  cableCombModelPropsSchema,
  type CableCombModelPropsInput,
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
function createCableCombSolid(input: CableCombModelPropsInput) {
  const p = cableCombModelPropsSchema.parse(input)
  const block = primitives.cuboid({
    size: [p.width, p.depth, p.height],
    center: [0, 0, p.height / 2],
  })
  const slots = Array.from({ length: p.slotCount }, (_, i) =>
    primitives.cuboid({
      size: [p.slotWidth, p.depth + 2, p.slotDepth + 1],
      center: [
        (i - (p.slotCount - 1) / 2) * p.slotPitch,
        0,
        p.height - p.slotDepth / 2 + 0.5,
      ],
    }),
  )
  const bores = [-1, 1].map((sign) =>
    primitives.cylinder({
      radius: p.holeDiameter / 2,
      height: p.height + 2,
      center: [(sign * p.holePitch) / 2, 0, p.height / 2],
      segments: 96,
    }),
  )
  return booleans.subtract(block, ...slots, ...bores)
}
export function createCableCombMesh(input: CableCombModelPropsInput) {
  const p = cableCombModelPropsSchema.parse(input)
  const planes: number[][] = [
    [
      -p.width / 2,
      p.width / 2,
      ...Array.from({ length: p.slotCount }, (_, i) => [
        (i - (p.slotCount - 1) / 2) * p.slotPitch - p.slotWidth / 2,
        (i - (p.slotCount - 1) / 2) * p.slotPitch + p.slotWidth / 2,
      ]).flat(),
    ],
    [-p.depth / 2, p.depth / 2],
    [0, p.height - p.slotDepth, p.height],
  ]
  const geom = createCableCombSolid(p)
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
export function createCableCombGeom(input: CableCombModelPropsInput) {
  return indexedMeshToGeom3(createCableCombMesh(input))
}
