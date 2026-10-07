import { mp } from "@tscircuit/modelprinter"
import { createNemaMotorMountMesh } from "../../lib/models/nemamotormount"
import { renderModelSnapshot } from "./render-model-snapshot"

export const nemaMotorMountStrings = {
  17: "nemamotormount_nema17_w50mm_h60mm_depth40mm_t3mm_axisheight30mm_shaft23mm_motorhole3.5mm_basehole5.5mm_basexspan30mm_baseoffset20mm",
  23: "nemamotormount_nema23_w70mm_h80mm_depth50mm_t4mm_axisheight40mm_shaft39.1mm_motorhole5.5mm_basehole5.5mm_basexspan45mm_baseoffset25mm",
} as const

export function mountDefinition(nemaSize: 17 | 23) {
  const definition = mp.string(nemaMotorMountStrings[nemaSize]).json()
  if (definition.fn !== "nemamotormount") throw new Error("Wrong family")
  return definition
}

export async function renderNemaMotorMountSnapshot(nemaSize: 17 | 23) {
  const { fn, ...props } = mountDefinition(nemaSize)
  const mesh = createNemaMotorMountMesh(props)
  // Present the physical +Y-up bracket in the snapshot fixture's +Z-up views.
  // This is a rigid display rotation, leaving the factory's motor datum intact.
  for (let index = 0; index < mesh.positions.length; index += 3) {
    const y = mesh.positions[index + 1]!,
      z = mesh.positions[index + 2]!
    mesh.positions[index + 1] = -z
    mesh.positions[index + 2] = y
  }
  const span = nemaSize === 17 ? 110 : 140
  return renderModelSnapshot({
    mesh,
    title: `NEMA${nemaSize} MOTOR MOUNT / RIGID L BRACKET`,
    modelString: nemaMotorMountStrings[nemaSize],
    views: [
      {
        name: "ISOMETRIC",
        detail: "MOTOR FACE AND TWO BASE FIXINGS",
        eye: [115, -140, 105],
        target: [0, 14, 0],
        span,
      },
      {
        name: "TOP",
        detail: "BASE HOLES / FOOT EXTENDS UNDER MOTOR",
        eye: [0, 15, 160],
        target: [0, 15, 0],
        span,
      },
      {
        name: "FRONT",
        detail: "FOUR FIXINGS AND OPEN PILOT CLEARANCE",
        eye: [0, -160, 0],
        target: [0, 0, 0],
        span,
      },
      {
        name: "SIDE",
        detail: "SHARP 90 DEG CORNER / UNIFORM THICKNESS",
        eye: [160, 15, 0],
        target: [0, 15, 0],
        span,
      },
    ],
    footer:
      "MILLIMETERS | MOTOR FACE / SHAFT AXIS AT ORIGIN | PILOT AND ALL SIX FIXINGS OPEN THROUGH",
  })
}
