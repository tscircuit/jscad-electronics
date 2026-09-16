/** Nordic QFAA: 48-pin QFN with a 6 x 6 x 0.6 mm molded body.
 * Package drawing: https://docs.nordicsemi.com/r/bundle/ps_nrf52810/page/package_qfn48.html
 * A2=0.6 is the mold height represented by the source 3D model; the embedded
 * A3 leadframe does not add to that solid. Its 4.6 mm exposed pad identifies
 * this outline among 48-pin QFN footprints.
 */
/** `pillpads` is omitted only because the diagnostic copper renderer does not
 * yet support Footprinter's `rotated_pill` shape. It does not affect routing.
 */
export const qfnQfaa48Footprint =
  "qfn48_thermalpad4.6mmx4.6mm_p0.4mm_h7.15mm_pw0.2mm_pl0.95mm_pin1location(bottomside,left)"

export const qfnQfaa48BenchmarkFootprint =
  "qfn48_thermalpad4.6mmx4.6mm_pillpads_p0.4mm_h7.15mm_pw0.2mm_pl0.95mm_pin1location(bottomside,left)"
