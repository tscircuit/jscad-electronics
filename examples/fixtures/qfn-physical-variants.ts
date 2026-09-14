/** Standard QFN outlines; part numbers are reference examples, never selectors.
 * C17146 / LAN8720AI-CP-TR: https://ww1.microchip.com/downloads/en/DeviceDoc/00002165B.pdf
 * 24-QFN table, p66: nominal D/E=4, D1/E1=3.75, A=.85, A1=.02,
 * exposed pad 2.5 square, terminal .25 x .4, pitch .5.
 * The inset top face approximates the mold-cap profile; the base step, optional
 * corner chamfers and rounded terminal ends are omitted. Metal thickness .2 is
 * an approximation (not separately dimensioned in this drawing).
 * C9120 / CC2530F256RHAR: https://www.ti.com/lit/ds/symlink/cc2530.pdf
 * RHA0040H: nominal body 6 square, exposed pad 4.5 square, pitch .5,
 * midpoint terminal .25 x .4 and standoff .025; typical metal thickness .2.
 * Overall height .9 is representative below 1.0 max; straight sawn mold.
 * Existing standard strings draw rectangular copper pads only, in default orientation.
 * Explicit package geometry does not consume or extend Footprinter syntax.
 */
export const qfnPhysicalVariants = {
  "24 terminals, 4 x 4 mm": {
    footprint: "qfn24_thermalpad2.55mmx2.55mm_h4.68mm_pw0.28mm_pl0.66mm",
    props: {
      num_pins: 24,
      bodyWidth: 4,
      bodyLength: 4,
      bodyHeight: 0.85,
      standoff: 0.02,
      terminalSpanX: 4,
      terminalSpanY: 4,
      terminalThickness: 0.2,
      padWidth: 0.25,
      padLength: 0.4,
      pitch: 0.5,
      exposedPadWidth: 2.5,
      exposedPadLength: 2.5,
      topInset: 0.125,
    },
  },
  "40 terminals, 6 x 6 mm": {
    footprint: "qfn40_thermalpad4.1mmx4.1mm_pw0.28mm_pl0.8mm",
    props: {
      num_pins: 40,
      bodyWidth: 6,
      bodyLength: 6,
      bodyHeight: 0.9,
      standoff: 0.025,
      terminalSpanX: 6,
      terminalSpanY: 6,
      terminalThickness: 0.2,
      padWidth: 0.25,
      padLength: 0.4,
      pitch: 0.5,
      exposedPadWidth: 4.5,
      exposedPadLength: 4.5,
      topInset: 0,
    },
  },
}
