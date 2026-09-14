/** JEDEC MO-150 / TI DB0028A: https://www.ti.com/lit/pdf/mpds510
 * Midpoint mold 5.3 x 10.2, span 7.8, terminal width .30, contact .75;
 * pitch .65 and metal .15 typical. Height 1.85 below A=2 max and standoff
 * .10 above .05 min are representative. Mold draft .12 is approximate.
 * JLC comparison example C136617 GL850G-HHY22; never a selector.
 * All dimensions are mm; package props are independent of footprint strings.
 */
export const ssopStandardVariants = {
  "28 leads, MO-150": {
    footprint: "ssop28_p0.65mm_w8.93mm_pw0.36mm_pl2.02mm",
    props: {
      pinCount: 28,
      pitch: 0.65,
      bodyWidth: 5.3,
      bodyLength: 10.2,
      bodyHeight: 1.85,
      standoff: 0.1,
      leadSpan: 7.8,
      leadWidth: 0.3,
      leadThickness: 0.15,
      contactLength: 0.75,
      taperInset: 0.12,
    },
  },
}
