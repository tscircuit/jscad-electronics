import jscad from "@jscad/modeling"
import { geometryToCableMesh } from "./geometry-to-mesh"
import type { CableConnectorSpec, CableMesh } from "./types"

/** Right-handed connector-local mm: mating tip/mouth at z=0, +Z to wire exit.
 * Female socket is hollow; male contact has a rounded tip and spring slots.
 */
export function createBulletMeshes(
  connector: Extract<
    CableConnectorSpec,
    { kind: "bullet_male" | "bullet_female" }
  >,
): CableMesh[] {
  const { cylinder, sphere, cuboid } = jscad.primitives
  const { subtract, union } = jscad.booleans
  const { diameter, contactDepth, bodyDepth, bodyWidth, kind } = connector
  const radius = diameter / 2
  let contact =
    kind === "bullet_male"
      ? union(
          sphere({ radius, center: [0, 0, radius], segments: 32 }),
          cylinder({
            radius,
            height: contactDepth - radius,
            center: [0, 0, (contactDepth + radius) / 2],
            segments: 32,
          }),
        )
      : subtract(
          cylinder({
            radius: bodyWidth / 2,
            height: contactDepth,
            center: [0, 0, contactDepth / 2],
            segments: 32,
          }),
          cylinder({
            radius,
            height: contactDepth - diameter / 4 + 0.1,
            center: [0, 0, (contactDepth - diameter / 4 - 0.1) / 2],
            segments: 32,
          }),
        )
  if (kind === "bullet_male") {
    contact = subtract(
      contact,
      cuboid({
        size: [diameter + 0.2, diameter * 0.08, contactDepth * 0.65],
        center: [0, 0, contactDepth * 0.45],
      }),
      cuboid({
        size: [diameter * 0.08, diameter + 0.2, contactDepth * 0.65],
        center: [0, 0, contactDepth * 0.45],
      }),
    )
  }
  const cupDepth = bodyDepth - contactDepth
  const solderCup = subtract(
    cylinder({
      radius: bodyWidth / 2,
      height: cupDepth,
      center: [0, 0, contactDepth + cupDepth / 2],
      segments: 32,
    }),
    cylinder({
      radius: radius * 0.75,
      height: cupDepth * 0.8 + 0.1,
      center: [0, 0, bodyDepth - cupDepth * 0.4 + 0.05],
      segments: 32,
    }),
  )
  return [
    geometryToCableMesh({
      geometry: contact,
      color: [0.83, 0.64, 0.22, 1],
      name: kind === "bullet_male" ? "bullet-pin" : "bullet-socket",
    }),
    geometryToCableMesh({
      geometry: solderCup,
      color: [0.83, 0.64, 0.22, 1],
      name: "solder-cup",
    }),
  ]
}
