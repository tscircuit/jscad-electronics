import jscad from "@jscad/modeling"
import type { NemaMotorModelProps } from "./nemaMotorParameters"

/** Illustrative front tie-rod heads and edge recesses from the NEMA34 photo.
 * Assembly screws sit beside, rather than inside, the four mounting holes.
 */
export function nema34AssemblyCenters(p: NemaMotorModelProps) {
  const edge = p.bodyWidth / 2
  return [-1, 1].flatMap((side) =>
    [-1, 1].map(
      (end) => [side * (edge - 3.5), end * p.bodyWidth * 0.26] as const,
    ),
  )
}

export function cutNema34FrontRecesses(
  geometry: jscad.geometries.geom3.Geom3,
  p: NemaMotorModelProps,
) {
  return jscad.booleans.subtract(
    geometry,
    ...nema34AssemblyCenters(p).flatMap(([x, y]) => [
      jscad.primitives.cylinder({
        radius: 1.6,
        height: p.frontCapLength + 0.2,
        center: [x, y, -p.frontCapLength / 2],
        segments: 32,
      }),
      jscad.primitives.cylinder({
        radius: 5,
        height: Math.min(4, p.frontCapLength / 2) + 0.1,
        center: [
          (Math.sign(x) * p.bodyWidth) / 2,
          y,
          -Math.min(4, p.frontCapLength / 2) / 2 + 0.05,
        ],
        segments: 48,
      }),
    ]),
  )
}

export function createNema34FrontScrews(p: NemaMotorModelProps) {
  const head = jscad.booleans.subtract(
    jscad.primitives.ellipsoid({
      radius: [3.2, 3.2, 1.5],
      center: [0, 0, -1.8],
      segments: 32,
    }),
    ...[
      [3.7, 0.8, 1.1],
      [0.8, 3.7, 1.1],
    ].map((size) =>
      jscad.primitives.cuboid({
        size: size as [number, number, number],
        center: [0, 0, -0.8],
      }),
    ),
  )
  return nema34AssemblyCenters(p).map(([x, y]) =>
    jscad.transforms.translate([x, y, 0], head),
  )
}
