import jscad from "@jscad/modeling"
export const { union, subtract } = jscad.booleans
export const { cuboid: box, sphere } = jscad.primitives
const { cylinder, cylinderElliptic } = jscad.primitives
const { rotateX, rotateY, rotateZ, translate } = jscad.transforms
export function solidX(diameter: number, length: number, x = 0, y = 0, z = 0) {
  return translate(
    [x, y, z],
    rotateY(
      Math.PI / 2,
      cylinder({ radius: diameter / 2, height: length, segments: 48 }),
    ),
  )
}
export function solidY(diameter: number, length: number, x = 0, y = 0, z = 0) {
  return translate(
    [x, y, z],
    rotateX(
      Math.PI / 2,
      cylinder({ radius: diameter / 2, height: length, segments: 48 }),
    ),
  )
}
export function solidZ(diameter: number, length: number, x = 0, y = 0, z = 0) {
  return cylinder({
    radius: diameter / 2,
    height: length,
    segments: 48,
    center: [x, y, z],
  })
}
export function hexX(acrossFlats: number, length: number, x = 0, y = 0, z = 0) {
  return translate(
    [x, y, z],
    rotateY(
      Math.PI / 2,
      rotateZ(
        Math.PI / 6,
        cylinder({
          radius: acrossFlats / Math.sqrt(3),
          height: length,
          segments: 6,
        }),
      ),
    ),
  )
}
export function taperX(
  startDiameter: number,
  endDiameter: number,
  length: number,
  x = 0,
) {
  return translate(
    [x, 0, 0],
    rotateY(
      Math.PI / 2,
      cylinderElliptic({
        height: length,
        startRadius: [startDiameter / 2, startDiameter / 2],
        endRadius: [endDiameter / 2, endDiameter / 2],
        segments: 48,
      }),
    ),
  )
}
/** Overshoot scales with the body so bores never leave a coplanar end cap. */
export const overrun = (size: number) => Math.max(size * 1e-4, 1e-5)
