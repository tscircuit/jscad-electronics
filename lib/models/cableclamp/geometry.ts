import {
  cableClampModelPropsSchema,
  getCableClampDimensions,
  type CableClampModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  circularProfile,
  extrudePlanarProfile,
  joinProfileMeshes,
  type ProfilePoint,
} from "../../mechanical/extrude-planar-profile"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"

/** Sew the closed band to a pierced tab without internal seam faces. */
export function createCableClampMesh(input: CableClampModelPropsInput) {
  const p = cableClampModelPropsSchema.parse(input)
  const d = getCableClampDimensions(p)
  const joinX = -d.radius
  const lowerArcX = -Math.sqrt(d.radius ** 2 - (p.innerDiameter / 2) ** 2)
  const endAngle = Math.atan2(-p.innerDiameter / 2, lowerArcX) + 2 * Math.PI
  const outer: ProfilePoint[] = [
    [joinX, 0],
    [0, 0],
  ]
  for (
    let angle = -Math.PI / 2;
    angle < endAngle - 1e-12;
    angle += Math.PI / 32
  )
    outer.push([
      d.radius * Math.cos(angle),
      d.ringCenterZ + d.radius * Math.sin(angle),
    ])
  outer.push([lowerArcX, 2 * p.thickness], [joinX, 2 * p.thickness])
  const band = extrudePlanarProfile({
    outer,
    holes: [circularProfile(0, d.ringCenterZ, p.innerDiameter / 2, 64)],
    start: -p.bandWidth / 2,
    end: p.bandWidth / 2,
    project: (x, z, y) => [x, y, z],
    reverse: true,
    skipWall: (a, b) => a[0] === joinX && b[0] === joinX,
  })
  const tab = extrudePlanarProfile({
    outer: [
      [joinX - p.tabLength, -p.bandWidth / 2],
      [joinX, -p.bandWidth / 2],
      [joinX, p.bandWidth / 2],
      [joinX - p.tabLength, p.bandWidth / 2],
    ],
    holes: [circularProfile(d.mountingHoleX, 0, p.holeDiameter / 2, 64)],
    start: 0,
    end: 2 * p.thickness,
    skipWall: (a, b) => a[0] === joinX && b[0] === joinX,
  })
  return joinProfileMeshes([band, tab])
}

/** Complete P-shaped strap, closed cable passage, and vertical mounting bore. */
export function createCableClampGeom(input: CableClampModelPropsInput) {
  return indexedMeshToGeom3(createCableClampMesh(input))
}
