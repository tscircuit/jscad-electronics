import jscad from "@jscad/modeling"
export type MachinePoint = [number, number, number]
export type MachineSolid = jscad.geometries.geom3.Geom3
export const machineBox = (
  size: MachinePoint,
  center: MachinePoint,
): MachineSolid => jscad.primitives.cuboid({ size, center })
export function machineCylinder(
  diameter: number,
  length: number,
  center: MachinePoint,
  axis: "x" | "y" | "z" = "z",
  segments = 48,
): MachineSolid {
  const solid = jscad.primitives.cylinder({
    radius: diameter / 2,
    height: length,
    segments,
  })
  return jscad.transforms.translate(
    center,
    axis === "x"
      ? jscad.transforms.rotateY(Math.PI / 2, solid)
      : axis === "y"
        ? jscad.transforms.rotateX(Math.PI / 2, solid)
        : solid,
  )
}
/** Round nominal linkage between endpoints; no joint or kinematic claim. */
export function machineRod(
  a: MachinePoint,
  b: MachinePoint,
  diameter: number,
): MachineSolid {
  const dx = b[0] - a[0],
    dy = b[1] - a[1],
    dz = b[2] - a[2]
  const length = Math.hypot(dx, dy, dz)
  const solid = jscad.primitives.cylinder({
    radius: diameter / 2,
    height: length,
    segments: 32,
  })
  return jscad.transforms.translate(
    [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2],
    jscad.transforms.rotateZ(
      Math.atan2(dy, dx),
      jscad.transforms.rotateY(Math.acos(dz / length), solid),
    ),
  )
}
export const machineUnion = (...solids: MachineSolid[]) =>
  jscad.booleans.union(...solids)
export const machineSubtract = (solid: MachineSolid, ...cuts: MachineSolid[]) =>
  jscad.booleans.subtract(solid, ...cuts)
export const machineRotateZ = (angle: number, solid: MachineSolid) =>
  jscad.transforms.rotateZ(angle, solid)
