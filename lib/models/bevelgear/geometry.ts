import jscad from "@jscad/modeling"
import {
  bevelGearModelPropsSchema,
  type BevelGearModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
const { primitives, booleans, geometries } = jscad
function tooth(
  bottomRadius: number,
  topRadius: number,
  depth: number,
  height: number,
  angle: number,
  halfAngle: number,
) {
  const ring = (r: number, z: number): [number, number, number][] => [
    [
      (r - depth) * Math.cos(angle - halfAngle),
      (r - depth) * Math.sin(angle - halfAngle),
      z,
    ],
    [r * Math.cos(angle - halfAngle), r * Math.sin(angle - halfAngle), z],
    [r * Math.cos(angle), r * Math.sin(angle), z],
    [r * Math.cos(angle + halfAngle), r * Math.sin(angle + halfAngle), z],
    [
      (r - depth) * Math.cos(angle + halfAngle),
      (r - depth) * Math.sin(angle + halfAngle),
      z,
    ],
  ]
  // Keep each end cap convex: an inner arc midpoint would make this polygon
  // concave, which violates JSCAD boolean input requirements.
  const bottom = ring(bottomRadius, 0),
    top = ring(topRadius, height)
  const faces = [
    geometries.poly3.fromPoints([...bottom].reverse()),
    geometries.poly3.fromPoints(top),
  ]
  for (let i = 0; i < bottom.length; i++)
    faces.push(
      geometries.poly3.fromPoints([
        bottom[i]!,
        bottom[(i + 1) % bottom.length]!,
        top[(i + 1) % bottom.length]!,
        top[i]!,
      ]),
    )
  return geometries.geom3.create(faces)
}
/** Tapered nominal tooth envelopes for assembly visualization; no conjugate-profile claim. */
export function createBevelGearGeom(input: BevelGearModelPropsInput = {}) {
  const p = bevelGearModelPropsSchema.parse(input)
  const root = primitives.cylinderElliptic({
    startRadius: [
      p.outerDiameter / 2 - p.toothDepth,
      p.outerDiameter / 2 - p.toothDepth,
    ],
    endRadius: [
      p.topDiameter / 2 - p.toothDepth,
      p.topDiameter / 2 - p.toothDepth,
    ],
    height: p.height,
    center: [0, 0, p.height / 2],
    segments: 96,
  })
  const hub = primitives.cylinder({
    radius: p.hubDiameter / 2,
    height: p.hubHeight,
    center: [0, 0, p.height + p.hubHeight / 2],
    segments: 64,
  })
  const solids = [root, hub]
  for (let i = 0; i < p.teeth; i++)
    solids.push(
      tooth(
        p.outerDiameter / 2,
        p.topDiameter / 2,
        p.toothDepth * 1.03,
        p.height,
        (2 * Math.PI * i) / p.teeth,
        (Math.PI * 0.42) / p.teeth,
      ),
    )
  const bore = primitives.cylinder({
    radius: p.boreDiameter / 2,
    height: p.height + p.hubHeight + 2,
    center: [0, 0, (p.height + p.hubHeight) / 2],
    segments: 64,
  })
  return booleans.subtract(booleans.union(...solids), bore)
}
export function createBevelGearMesh(input: BevelGearModelPropsInput = {}) {
  return geom3ToIndexedMesh(createBevelGearGeom(input))
}
