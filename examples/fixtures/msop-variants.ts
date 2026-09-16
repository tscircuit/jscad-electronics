/** JEDEC MO-187 BA and BA-T physical variants; no manufacturer selectors.
 * C11355 / FSUSB42MUX: https://www.onsemi.com/pdf/datasheet/fsusb42-d.pdf
 * Case 846AP, page 9: nominal mold 3 x 3 x .85, midpoint A1=.075,
 * lead width .22, thickness .155, span 4.9, contact .6, pitch .5.
 * Per-side taper .09 approximates the drawing's 12-degree mold draft.
 * C26350 / XTR111AIDGQR: https://www.ti.com/lit/ds/symlink/xtr111.pdf
 * DGQ0010D, page 33: same MO-187 outline with exposed pad 1.73 x 1.79
 * (midpoints), A1=.1, c=.18, contact .55; A=1 is representative below 1.1 max.
 * Pad corner notches and lead-frame tie bars are not represented.
 * Rectangular-pad DFN placement strings below are placement context ONLY: they do not
 * identify an MSOP package and are never routed to this component automatically.
 * Preview strings use default pin-1 orientation and rectangular copper pads.
 */
export const msopVariants = {
  "10 leads, 3 x 3 mm": {
    footprint: "dfn10_p0.5mm_w5.84mm_pw0.28mm_pl1.62mm",
    props: {
      pinCount: 10,
      pitch: 0.5,
      bodyWidth: 3,
      bodyLength: 3,
      bodyHeight: 0.925,
      standoff: 0.075,
      leadSpan: 4.9,
      leadWidth: 0.22,
      leadThickness: 0.155,
      contactLength: 0.6,
      taperInset: 0.09,
    },
  },
  "10 leads, exposed pad": {
    footprint: "dfn10_thermalpad1.83mmx2.1mm_p0.5mm_w5.84mm_pw0.28mm_pl1.62mm",
    props: {
      pinCount: 10,
      pitch: 0.5,
      bodyWidth: 3,
      bodyLength: 3,
      bodyHeight: 1,
      standoff: 0.1,
      leadSpan: 4.9,
      leadWidth: 0.22,
      leadThickness: 0.18,
      contactLength: 0.55,
      taperInset: 0.09,
      exposedPadWidth: 1.73,
      exposedPadLength: 1.79,
    },
  },
}
