import { createShaftCollarMesh } from "../../lib/models/shaftcollar"
import type { MountMesh } from "./assert-shaft-mount-geometry"
export const example = "shaftcollar_bore8mm_od16mm_w8mm_mount(setscrew)_m4"
export const props = {
  boreDiameter: 8,
  outerDiameter: 16,
  width: 8,
  metricSize: "M4" as const,
}
let cached: MountMesh | undefined
export const mesh = () => (cached ??= createShaftCollarMesh(props))
