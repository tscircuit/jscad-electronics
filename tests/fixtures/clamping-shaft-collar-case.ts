import { createClampingShaftCollarMesh } from "../../lib/models/clampingshaftcollar"
import type { MountMesh } from "./assert-shaft-mount-geometry"
export const example =
  "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4"
export const props = {
  boreDiameter: 8,
  outerDiameter: 18,
  width: 9,
  splitWidth: 1,
  metricSize: "M4" as const,
}
let cached: MountMesh | undefined
export const mesh = () => (cached ??= createClampingShaftCollarMesh(props))
