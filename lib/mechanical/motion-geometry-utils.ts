import jscad from "@jscad/modeling"
const { primitives, transforms, booleans, extrusions } = jscad
export type MotionGeom3 = jscad.geometries.geom3.Geom3
export type MotionPoint3 = [number, number, number]
/** Mechanical geometry helpers use millimeters and explicit end-plane datums. */
export function motionCylinder(
  diameter: number,
  height: number,
  bottomZ = 0,
): MotionGeom3 {
  return primitives.cylinder({
    radius: diameter / 2,
    height,
    center: [0, 0, bottomZ + height / 2],
    segments: 48,
  })
}
export function motionRing(
  outerDiameter: number,
  innerDiameter: number,
  height: number,
  bottomZ = 0,
): MotionGeom3 {
  return booleans.subtract(
    motionCylinder(outerDiameter, height, bottomZ),
    motionCylinder(innerDiameter, height + 0.2, bottomZ - 0.1),
  )
}
export function motionBox(
  width: number,
  depth: number,
  height: number,
  center: MotionPoint3,
): MotionGeom3 {
  return primitives.cuboid({ size: [width, depth, height], center })
}
export function motionCylinderY(
  diameter: number,
  length: number,
  center: MotionPoint3,
): MotionGeom3 {
  return transforms.translate(
    center,
    transforms.rotateX(
      Math.PI / 2,
      motionCylinder(diameter, length, -length / 2),
    ),
  )
}
export function motionCylinderX(
  diameter: number,
  length: number,
  center: MotionPoint3,
): MotionGeom3 {
  return transforms.translate(
    center,
    transforms.rotateY(
      Math.PI / 2,
      motionCylinder(diameter, length, -length / 2),
    ),
  )
}
export function motionRevolve(points: [number, number][]): MotionGeom3 {
  return extrusions.extrudeRotate(
    { segments: 64 },
    primitives.polygon({ points }),
  )
}
