import { createRigidCouplerMesh } from "../../lib/models/rigidcoupler"
import type { MountMesh } from "./assert-shaft-mount-geometry"
export const example =
  "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4"
export const props = {
  boreDiameter: 8,
  outerDiameter: 20,
  length: 25,
  metricSize: "M4" as const,
}
let cached: MountMesh | undefined
export const mesh = () => (cached ??= createRigidCouplerMesh(props))
