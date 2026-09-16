import {
  createDualRowGullWing,
  type DualRowGullWingDimensions,
} from "./utils/DualRowGullWing"
/** Explicit SSOP physical outline (e.g. JEDEC MO-150), in mm. Copper land
 * dimensions do not identify the package. Pin 1 is at -X,+Y; Z=0 seats the feet.
 * Mold draft, bend curvature and the pin-1 dimple are visual approximations.
 */
export type SSOPProps = Omit<
  DualRowGullWingDimensions,
  "exposedPadWidth" | "exposedPadLength"
>
export const SSOP = (props: SSOPProps) => createDualRowGullWing(props)
