import {
  FlatLeadDiode,
  type FlatLeadDiodeDimensions,
} from "./utils/FlatLeadDiode"
/** DO-219AD flat-lead outline, with independently sized cathode/anode contacts.
 * Nominal defaults are midpoints of the outline ranges on page 3.
 * Mold taper and marking dimensions are visual approximations, exposed as props.
 * https://www.vishay.com/doc/?89019=
 * Dimension overrides represent variants of this standard outline. They are
 * geometry parameters, not new Footprinter tokens or manufacturer selectors.
 */
export type DO219ADProps = Partial<FlatLeadDiodeDimensions>
export const DO219AD = (props: DO219ADProps) => (
  <FlatLeadDiode
    {...{
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
    }}
    {...props}
  />
)
