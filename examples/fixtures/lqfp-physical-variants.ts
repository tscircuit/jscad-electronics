/** Parameterized standard LQFP dimensions, not manufacturer presets/selectors.
 * C46830 / STM32F030K6T6: https://www.st.com/resource/en/datasheet/stm32f030f4.pdf
 * Table 61: nominal mold 7 square, outer span 9, pitch .8, lead width .37.
 * C28730 / STM32F407VET6 and C19156 / STM32F407ZGT6:
 * https://www.st.com/resource/en/datasheet/stm32f407vg.pdf
 * Tables 93/94: mold 14/20 square, outer span 16/22, pitch .5, lead width .22.
 * All: nominal mold thickness A2=1.4 plus midpoint standoff A1=.1 gives A=1.5;
 * contact .6, midpoint plated-lead thickness .145. Taper .15 approximates the
 * 12-degree draft across half the mold height. Dimple, bend profile and level
 * terminal feet are approximations; detailed corner chamfers are omitted.
 * Existing standard QFN-style strings draw rectangular copper pads only.
 * Their pad layout does not identify LQFP and is not used for model selection.
 */
export const lqfpPhysicalVariants = {
  "32 leads, 7 x 7 mm": {
    footprint: "qfn32_p0.8mm_w10.61mm_h10.59mm_pw0.45mm_pl1.65mm",
    props: {
      pinCount: 32,
      pitch: 0.8,
      bodyWidth: 7,
      bodyLength: 7,
      bodyHeight: 1.5,
      standoff: 0.1,
      leadSpanX: 9,
      leadSpanY: 9,
      leadWidth: 0.37,
      leadThickness: 0.145,
      contactLength: 0.6,
      taperInset: 0.15,
    },
  },
  "100 leads, 14 x 14 mm": {
    footprint: "qfn100_h16.9mm_pw0.3mm_pl1.6mm",
    props: {
      pinCount: 100,
      pitch: 0.5,
      bodyWidth: 14,
      bodyLength: 14,
      bodyHeight: 1.5,
      standoff: 0.1,
      leadSpanX: 16,
      leadSpanY: 16,
      leadWidth: 0.22,
      leadThickness: 0.145,
      contactLength: 0.6,
      taperInset: 0.15,
    },
  },
  "144 leads, 20 x 20 mm": {
    footprint: "qfn144_h23.8mm_pw0.28mm_pl2mm",
    props: {
      pinCount: 144,
      pitch: 0.5,
      bodyWidth: 20,
      bodyLength: 20,
      bodyHeight: 1.5,
      standoff: 0.1,
      leadSpanX: 22,
      leadSpanY: 22,
      leadWidth: 0.22,
      leadThickness: 0.145,
      contactLength: 0.6,
      taperInset: 0.15,
    },
  },
}
