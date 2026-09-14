/** Case drawings validate dimensions; these names/IDs never select a model.
 * DPY0002A: https://www.ti.com/lit/ds/symlink/tpd1e10b06.pdf (page 19)
 * 152AF: https://www.onsemi.com/download/data-sheet/pdf/esd8472-d.pdf (page 5)
 */
export const dfnVariants = {
  "1.0 × 0.6 mm, two leads": {
    // JLCPCB C48260 / TPD1E10B06DPYR and C436349 / TPD1E05U06DPYR.
    // Existing placement examples; these ambiguous strings do not identify DFN.
    footprint: "smdpads2_p1mm_pw0.6mm_ph0.6mm",
    props: {
      num_pins: 2,
      bodyStyle: "rectangular" as const,
      bodyWidth: 1,
      bodyLength: 0.6,
      bodyThickness: 0.35,
      standoff: 0.025,
      padLength: 0.25,
      padWidth: 0.5,
      terminalInset: 0.05,
      terminalThickness: 0.05,
      pin1MarkWidth: 0.07,
    },
  },
  "0.62 × 0.32 mm, two leads": {
    // JLCPCB C133346 / ESD8472MUT5G. Reference height is below the current drawing;
    // preserve the nominal 0.29 mm total height rather than fitting the reference.
    footprint: "smdpads2_p0.4mm_pw0.2mm_ph0.3mm",
    props: {
      num_pins: 2,
      bodyStyle: "rectangular" as const,
      bodyWidth: 0.62,
      bodyLength: 0.32,
      bodyThickness: 0.265,
      standoff: 0.025,
      padLength: 0.2,
      padWidth: 0.25,
      terminalInset: 0.0325,
      terminalThickness: 0.05,
      pin1TerminalChamfer: 0.05,
      pin1MarkWidth: 0.035,
    },
  },
}
