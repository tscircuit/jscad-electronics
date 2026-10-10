import { finishShaftMountMesh } from "../../mechanical/shaft-mount-geometry"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import jscad from "@jscad/modeling"
import {
  flatCableClipModelPropsSchema,
  type FlatCableClipModelPropsInput,
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
function createFlatCableClipSolid(input: FlatCableClipModelPropsInput) {
  const p = flatCableClipModelPropsSchema.parse(input)
  const legOuter = p.innerWidth / 2 + p.thickness,
    half = legOuter + p.footLength
  const points: [number, number][] = [
    [-half, 0],
    [-p.innerWidth / 2, 0],
    [-p.innerWidth / 2, p.innerHeight],
    [p.innerWidth / 2, p.innerHeight],
    [p.innerWidth / 2, 0],
    [half, 0],
    [half, p.thickness],
    [legOuter, p.thickness],
    [legOuter, p.innerHeight + p.thickness],
    [-legOuter, p.innerHeight + p.thickness],
    [-legOuter, p.thickness],
    [-half, p.thickness],
  ]
  const bridge = transforms.translate(
    [0, p.depth / 2, 0],
    transforms.rotateX(
      Math.PI / 2,
      extrusions.extrudeLinear(
        { height: p.depth },
        primitives.polygon({ points }),
      ),
    ),
  )
  const bores = [-1, 1].map((sign) =>
    primitives.cylinder({
      radius: p.holeDiameter / 2,
      height: p.thickness + 2,
      center: [(sign * p.holePitch) / 2, 0, p.thickness / 2],
      segments: 96,
    }),
  )
  return booleans.subtract(bridge, ...bores)
}
export function createFlatCableClipMesh(input: FlatCableClipModelPropsInput) {
  const p = flatCableClipModelPropsSchema.parse(input)
  const legOuter = p.innerWidth / 2 + p.thickness,
    half = legOuter + p.footLength
  const planes: number[][] = [
    [-half, -legOuter, -p.innerWidth / 2, p.innerWidth / 2, legOuter, half],
    [-p.depth / 2, p.depth / 2],
    [0, p.thickness, p.innerHeight, p.innerHeight + p.thickness],
  ]
  const geom = createFlatCableClipSolid(p)
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
export function createFlatCableClipGeom(input: FlatCableClipModelPropsInput) {
  return indexedMeshToGeom3(createFlatCableClipMesh(input))
}
