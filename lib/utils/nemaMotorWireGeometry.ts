import jscad from "@jscad/modeling"
import { getNemaMotorReferencePoints } from "@tscircuit/modelprinter"
import {
  resolveNemaMotorProps,
  type NemaMotorModelPropsInput,
} from "./nemaMotorParameters"

/** Visible wire termination in motor-local mm: +Z shaft, origin at front face.
 * Placement comes from the same spec reference used by assembly rotation.
 * JST-PH's representative six-position header is 13.9 mm wide, 4.5 mm thick,
 * 6 mm high, with 2 mm pitch; shell and contacts are illustrative.
 * https://www.jst-mfg.com/product/pdf/eng/ePH.pdf
 */
export function createNemaMotorWireGeometry(input: NemaMotorModelPropsInput) {
  const p = resolveNemaMotorProps(input)
  if (p.wireConnection === "none") return []
  const { position } = getNemaMotorReferencePoints(p).wireside
  const angle = (p.wireSideAngle * Math.PI) / 180
  // Only transform the direction/profile about +Z; the reference point already
  // includes its rotation. A point gets translation, a direction does not.
  const place = (geometry: jscad.geometries.geom3.Geom3) =>
    jscad.transforms.translate(
      [position.x, position.y, position.z],
      jscad.transforms.rotateZ(angle, geometry),
    )
  if (p.wireConnection === "stubs") {
    const colors = [
      "#d53f3f",
      "#2463af",
      "#3b934b",
      "#252830",
      "#e5d049",
      "#eeeeee",
      "#ce7432",
      "#803e91",
    ]
    return Array.from({ length: p.wireCount }, (_, i) => ({
      color: colors[i]!,
      geometry: place(
        jscad.transforms.translate(
          [
            (p.wireLength - 0.15) / 2,
            (i - (p.wireCount - 1) / 2) * p.wireDiameter * 1.5,
            0,
          ],
          jscad.transforms.rotateY(
            Math.PI / 2,
            jscad.primitives.cylinder({
              height: p.wireLength + 0.15,
              radius: p.wireDiameter / 2,
              segments: 24,
            }),
          ),
        ),
      ),
    }))
  }
  const shell = jscad.booleans.subtract(
    jscad.primitives.cuboid({ size: [6.1, 13.9, 4.5], center: [2.95, 0, 0] }),
    jscad.primitives.cuboid({ size: [5.5, 12.7, 3.3], center: [3.55, 0, 0] }),
  )
  return [
    { color: "#eeeeea", geometry: place(shell) },
    ...Array.from({ length: 6 }, (_, i) => ({
      color: "#b8bec6",
      geometry: place(
        jscad.primitives.cuboid({
          size: [3.4, 0.5, 0.5],
          center: [1.7, (i - 2.5) * 2, 0],
        }),
      ),
    })),
  ]
}
