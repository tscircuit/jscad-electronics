import {
  createFlatLeadDiode,
  type FlatLeadDiodeDimensions,
} from "./utils/FlatLeadDiode"
/** SOD-323HE flat-lead outline with symmetric contacts by default.
 * Dimensional reference: https://www.es.co.th/Schemetic/PDF/RFU02VSM6S.PDF
 * Defaults use nominal 2.0 x 1.4 mm mold, 2.5 mm lead span and 0.6 mm height.
 * Buried terminal length, taper and marking dimensions are visual approximations.
 * https://www.rohm.de/products/diodes/fast-recovery-diodes/standard/rfu02vsm6s-product
 * Dimension overrides represent variants of this standard outline. They are
 * geometry parameters, not new Footprinter tokens or manufacturer selectors.
 */
export type SOD323HEProps = Partial<FlatLeadDiodeDimensions>
export const SOD323HE = (props: SOD323HEProps) =>
  createFlatLeadDiode({
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

    ...props,
  })
