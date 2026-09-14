/** Standard TSSOP dimensional variants, never manufacturer-specific selectors.
 * C52717 / STM8S003F3P6TR: https://www.st.com/resource/en/datasheet/stm8s003f3.pdf
 * Table 53: nominal D=6.5, E1=4.4, E=6.4, pitch=.65, mold thickness A2=1;
 * midpoint A1=.1, b=.245, c=.145, nominal contact .6. Total height A2+A1=1.1.
 * C13622 / MSP430G2553IPW28R: https://www.ti.com/lit/ds/symlink/msp430g2553.pdf
 * PW (R-PDSO-G28), 4040064-7/G: JEDEC MO-153, midpoint D=9.7,
 * E1=4.4, E=6.4, b=.245, A1=.1, contact=.625; nominal c=.15.
 * Total height 1.1 is representative below 1.2 max. Taper is approximate.
 * The rectangular-pad DFN strings below only render pads; they do not identify TSSOP.
 * Footprinter and Footprinter3d selection remain unchanged.
 * Previews use supported rectangular-pad strings; pill-pad display is unsupported.
 */
export const tssopVariants = {
  "20 leads, 6.5 x 4.4 mm": {
    rotationZ: Math.PI / 2,
    footprint:
      "dfn20_p0.65mm_w7.48mm_pw0.36mm_pl1.74mm_pin1location(leftside,bottom)",
    props: {
      pinCount: 20,
      pitch: 0.65,
      bodyWidth: 4.4,
      bodyLength: 6.5,
      bodyHeight: 1.1,
      standoff: 0.1,
      leadSpan: 6.4,
      leadWidth: 0.245,
      leadThickness: 0.145,
      contactLength: 0.6,
      taperInset: 0.1,
    },
  },
  "28 leads, 9.7 x 4.4 mm": {
    rotationZ: Math.PI / 2,
    footprint:
      "dfn28_p0.65mm_w7.46mm_pw0.34mm_pl1.73mm_pin1location(leftside,bottom)",
    props: {
      pinCount: 28,
      pitch: 0.65,
      bodyWidth: 4.4,
      bodyLength: 9.7,
      bodyHeight: 1.1,
      standoff: 0.1,
      leadSpan: 6.4,
      leadWidth: 0.245,
      leadThickness: 0.15,
      contactLength: 0.625,
      taperInset: 0.1,
    },
  },
}
