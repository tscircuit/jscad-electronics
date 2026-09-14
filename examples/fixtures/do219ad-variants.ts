/** Standard-outline fixtures. Part identity is evidence only, never a selector.
 * JLCPCB reference example: C2980309 / MSS1P4-M3/89A.
 * Existing placement string: smdpads2_p1.84mm_pw1.35mm_ph0.95mm
 * Source: https://www.vishay.com/doc/?89019=
 * Second fixture exercises dimensional limits; it is not another manufacturer preset.
 */
export const do219adVariants = {
  "Nominal outline": {
    footprint: "smdpads2_p1.84mm_pw1.35mm_ph0.95mm",
    props: {
      bodyLength: 2.2,
      bodyWidth: 1.3,
      bodyHeight: 0.68,
      leadSpan: 2.5,
      cathodeLength: 1.3,
      cathodeWidth: 0.88,
      anodeLength: 0.65,
      anodeWidth: 0.65,
      terminalThickness: 0.195,
      standoff: 0.11,
      taperInset: 0.05,
      markingWidth: 0.23,
    },
  },
  "Dimensional variant": {
    props: {
      bodyLength: 2.1,
      bodyWidth: 1.2,
      bodyHeight: 0.63,
      leadSpan: 2.3,
      cathodeLength: 1.1,
      cathodeWidth: 0.78,
      anodeLength: 0.55,
      anodeWidth: 0.55,
      terminalThickness: 0.12,
      standoff: 0.05,
      taperInset: 0.04,
      markingWidth: 0.18,
    },
  },
}
