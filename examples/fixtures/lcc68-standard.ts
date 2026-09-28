import type { LCC68Props } from "../../lib/LCC68"

/** onsemi case 115AR, LCC68: https://www.onsemi.com/download/package-drawing/pdf/115ar.pdf
 * Midpoints of A, b, D/E and L; e=1.27 and D2/E2=23.50 are reference values.
 * Contact metal thickness is illustrative because the drawing does not specify it.
 */
export const lcc68Standard: LCC68Props = {
  bodySize: 24.195,
  height: 2.81,
  lidSize: 23.5,
  lidHeight: 0.15,
  contactPitch: 1.27,
  contactWidth: 0.635,
  contactLength: 1.27,
  contactThickness: 0.12,
}
