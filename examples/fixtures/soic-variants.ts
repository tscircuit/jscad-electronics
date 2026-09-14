/** MS-012 standard SOIC variants. References are validation examples, never selectors.
 * 8-EP: JLC C9864 (TPS5430DDAR); https://www.ti.com/lit/ds/symlink/tps5430.pdf
 * DDA0008J outline: nominal/midpoint E=6, E1=3.9, D=4.9, b=.41,
 * c=.175, A1=.075, exposed pad 2.3 x 2.8. A=1.6 is representative
 * below the 1.7 maximum; contact .6 is within .4–1.27. Taper is approximate.
 * 16: JLC C7512 (ULN2003ADR); https://www.ti.com/lit/ds/symlink/uln2003a.pdf
 * D (R-PDSO-G16), 4040047-6/M (MS-012 AC): nominal D=9.9, E1=3.9, E=6, e=1.27.
 * Placement strings below already exist in Footprinter and only draw PCB pads.
 * Preview strings use default pin-1 orientation and rectangular copper pads.
 */
export const soicVariants = {
  "8 leads, exposed pad": {
    footprint: "soic8_thermalpad2.5mmx3.5mm_w6.7mm_pl1.3mm",
    props: {
      pinCount: 8,
      pitch: 1.27,
      bodyWidth: 3.9,
      bodyLength: 4.9,
      bodyHeight: 1.6,
      standoff: 0.075,
      leadSpan: 6,
      leadWidth: 0.41,
      leadThickness: 0.175,
      contactLength: 0.6,
      taperInset: 0.1,
      exposedPadWidth: 2.3,
      exposedPadLength: 2.8,
    },
  },
  "16 leads, narrow body": {
    footprint: "soic16_w7.44mm_pl1.97mm",
    props: {
      pinCount: 16,
      pitch: 1.27,
      bodyWidth: 3.9,
      bodyLength: 9.9,
      bodyHeight: 1.6,
      standoff: 0.15,
      leadSpan: 6,
      leadWidth: 0.41,
      leadThickness: 0.2,
      contactLength: 0.6,
      taperInset: 0.1,
    },
  },
}
