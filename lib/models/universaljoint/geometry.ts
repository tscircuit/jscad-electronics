import jscad from "@jscad/modeling"
import {
  universalJointModelPropsSchema,
  getUniversalJointDimensions,
  type UniversalJointModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
const { primitives, booleans, transforms } = jscad
export function createUniversalJointParts(
  input: UniversalJointModelPropsInput = {},
) {
  const p = universalJointModelPropsSchema.parse(input)
  const { crossZ, crossSpan, earWidth } = getUniversalJointDimensions(p)
  const epsilon = Math.min(p.armThickness, p.hubLength) * 1e-4
  const cylinderX = (
    radius: number,
    length: number,
    x: number,
    y: number,
    z: number,
  ) =>
    transforms.translate(
      [x, y, z],
      transforms.rotateY(
        Math.PI / 2,
        primitives.cylinder({ radius, height: length, segments: 48 }),
      ),
    )
  const cylinderY = (
    radius: number,
    length: number,
    x: number,
    y: number,
    z: number,
  ) =>
    transforms.translate(
      [x, y, z],
      transforms.rotateX(
        Math.PI / 2,
        primitives.cylinder({ radius, height: length, segments: 48 }),
      ),
    )
  const hub = (z: number) =>
    primitives.cylinder({
      radius: p.outerDiameter / 2,
      height: p.hubLength,
      center: [0, 0, z + p.hubLength / 2],
      segments: 64,
    })
  const lower = [hub(0)],
    upper = [hub(p.length - p.hubLength)]
  const armHeight = crossZ - p.hubLength + epsilon
  for (const side of [-1, 1]) {
    const offset = (side * crossSpan) / 2
    lower.push(
      primitives.cuboid({
        size: [p.armThickness, earWidth, armHeight],
        center: [offset, 0, p.hubLength - epsilon + armHeight / 2],
      }),
      cylinderX(earWidth / 2, p.armThickness, offset, 0, crossZ),
    )
    upper.push(
      primitives.cuboid({
        size: [earWidth, p.armThickness, armHeight],
        center: [0, offset, p.length - p.hubLength + epsilon - armHeight / 2],
      }),
      cylinderY(earWidth / 2, p.armThickness, 0, offset, crossZ),
    )
  }
  const lowerBore = primitives.cylinder({
    radius: p.boreDiameter / 2,
    height: p.hubLength + 2 * epsilon,
    center: [0, 0, p.hubLength / 2],
    segments: 64,
  })
  const upperBore = primitives.cylinder({
    radius: p.boreDiameter / 2,
    height: p.hubLength + 2 * epsilon,
    center: [0, 0, p.length - p.hubLength / 2],
    segments: 64,
  })
  const lowerFork = booleans.subtract(
    booleans.union(...lower),
    lowerBore,
    cylinderX(
      p.crossDiameter / 2 + p.clearance,
      p.outerDiameter + 2,
      0,
      0,
      crossZ,
    ),
  )
  const upperFork = booleans.subtract(
    booleans.union(...upper),
    upperBore,
    cylinderY(
      p.crossDiameter / 2 + p.clearance,
      p.outerDiameter + 2,
      0,
      0,
      crossZ,
    ),
  )
  // The cross reaches through the fork journals to the outer ear faces.
  const cross = booleans.union(
    cylinderX(p.crossDiameter / 2, p.outerDiameter, 0, 0, crossZ),
    cylinderY(p.crossDiameter / 2, p.outerDiameter, 0, 0, crossZ),
  )
  return { forks: booleans.union(lowerFork, upperFork), cross }
}
export function createUniversalJointGeom(
  input: UniversalJointModelPropsInput = {},
) {
  const parts = createUniversalJointParts(input)
  return booleans.union(parts.forks, parts.cross)
}
export function createUniversalJointMesh(
  input: UniversalJointModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createUniversalJointGeom(input))
}
