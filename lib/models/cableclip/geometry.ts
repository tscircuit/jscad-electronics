import { finishShaftMountMesh } from "../../mechanical/shaft-mount-geometry"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import jscad from "@jscad/modeling"
import {
  cableClipModelPropsSchema,
  type CableClipModelPropsInput,
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
function createCableClipSolid(input: CableClipModelPropsInput) {
  const p = cableClipModelPropsSchema.parse(input)
  const outer = p.height / 2,
    inner = p.cableDiameter / 2 / Math.cos(Math.PI / 180)
  const halfGap = ((360 - p.arcDegrees) * Math.PI) / 360
  const steps = Math.max(48, Math.ceil(p.arcDegrees / 2))
  // Include exact cardinal points so the finite circular tessellation keeps the declared bounds.
  const angles = Array.from(
    { length: steps + 1 },
    (_, i) => halfGap + (i * p.arcDegrees * Math.PI) / (180 * steps),
  )
  for (const angle of [Math.PI / 2, Math.PI, (3 * Math.PI) / 2])
    if (
      angle > halfGap &&
      angle < 2 * Math.PI - halfGap &&
      !angles.some((value) => Math.abs(value - angle) < 1e-12)
    )
      angles.push(angle)
  angles.sort((a, b) => a - b)
  const points: [number, number][] = [
    ...angles.map(
      (a) =>
        [outer * Math.cos(a), outer + outer * Math.sin(a)] as [number, number],
    ),
    ...[...angles]
      .reverse()
      .map(
        (a) =>
          [inner * Math.cos(a), outer + inner * Math.sin(a)] as [
            number,
            number,
          ],
      ),
  ]
  const loop = transforms.translate(
    [0, p.width / 2, 0],
    transforms.rotateX(
      Math.PI / 2,
      extrusions.extrudeLinear(
        { height: p.width },
        primitives.polygon({ points }),
      ),
    ),
  )
  const tab = primitives.cuboid({
    size: [outer + p.tabLength, p.width, p.thickness],
    center: [(outer + p.tabLength) / 2, 0, p.thickness / 2],
  })
  const bore = primitives.cylinder({
    radius: p.holeDiameter / 2,
    height: p.thickness + 2,
    center: [outer + p.tabLength / 2, 0, p.thickness / 2],
    segments: 96,
  })
  return booleans.subtract(booleans.union(loop, tab), bore)
}
export function createCableClipMesh(input: CableClipModelPropsInput) {
  const p = cableClipModelPropsSchema.parse(input)
  const planes: number[][] = [
    [-p.height / 2, 0, p.height / 2 + p.tabLength],
    [-p.width / 2, p.width / 2],
    [0, p.thickness, p.height / 2, p.height],
  ]
  const geom = createCableClipSolid(p)
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
export function createCableClipGeom(input: CableClipModelPropsInput) {
  return indexedMeshToGeom3(createCableClipMesh(input))
}
