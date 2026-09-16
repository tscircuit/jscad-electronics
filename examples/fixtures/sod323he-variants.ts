/** Standard-outline fixtures. Part identity is evidence only, never a selector.
 * JLCPCB reference example: C509976 / RFU02VSM6STR.
 * Existing placement string: smdpads2_p2.1001mm_pw0.8mm_ph1.1mm
 * Source: https://www.rohm.de/products/diodes/fast-recovery-diodes/standard/rfu02vsm6s-product
 * Second fixture exercises dimensional limits; it is not another manufacturer preset.
 */
export const sod323heVariants = {
  "Nominal outline": {
    footprint: "smdpads2_p2.1001mm_pw0.8mm_ph1.1mm",
    props: {
      bodyLength: 2,
      bodyWidth: 1.4,
      bodyHeight: 0.6,
      leadSpan: 2.5,
      cathodeLength: 0.55,
      cathodeWidth: 0.8,
      anodeLength: 0.55,
      anodeWidth: 0.8,
      terminalThickness: 0.17,
      standoff: 0.05,
      taperInset: 0.15,
      markingWidth: 0.2,
    },
  },
  "Dimensional variant": {
    props: {
      bodyLength: 2.1,
      bodyWidth: 1.5,
      bodyHeight: 0.8,
      leadSpan: 2.7,
      cathodeLength: 0.6,
      cathodeWidth: 0.85,
      anodeLength: 0.6,
      anodeWidth: 0.85,
      terminalThickness: 0.27,
      standoff: 0.1,
      taperInset: 0.15,
      markingWidth: 0.2,
    },
  },
}
