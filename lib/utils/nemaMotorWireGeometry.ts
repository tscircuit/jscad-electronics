import jscad from "@jscad/modeling"
import {
  getJstMotorConnector,
  getNemaMotorReferencePoints,
} from "@tscircuit/modelprinter"
import {
  resolveNemaMotorProps,
  type NemaMotorModelPropsInput,
} from "./nemaMotorParameters"

/** Visible wire termination in motor-local mm: +Z shaft, origin at front face.
 * Placement comes from the same spec reference used by assembly rotation.
 * Header dimensions, pin count and pitch come from modelprinter's shared
 * JST PH/SH profile; shell and contacts are illustrative.
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
  const connector = getJstMotorConnector(p.wireConnection)!
  const { pinCount, pitch, bodyWidth, bodyHeight, matingDepth } = connector
  const wall = pitch === 2 ? 0.6 : 0.3
  const contactLength = pitch === 2 ? 3.4 : 2.4
  const contactSize = pitch === 2 ? 0.5 : 0.3
  const shell = jscad.booleans.subtract(
    jscad.primitives.cuboid({
      size: [matingDepth + 0.1, bodyWidth, bodyHeight],
      center: [(matingDepth - 0.1) / 2, 0, 0],
    }),
    jscad.primitives.cuboid({
      size: [matingDepth - 0.5, bodyWidth - 2 * wall, bodyHeight - 2 * wall],
      center: [matingDepth / 2 + 0.55, 0, 0],
    }),
  )
  return [
    { color: "#eeeeea", geometry: place(shell) },
    ...Array.from({ length: pinCount }, (_, i) => ({
      color: "#b8bec6",
      geometry: place(
        jscad.primitives.cuboid({
          size: [contactLength, contactSize, contactSize],
          center: [contactLength / 2, (i - (pinCount - 1) / 2) * pitch, 0],
        }),
      ),
    })),
  ]
}
