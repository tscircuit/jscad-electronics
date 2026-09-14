import { fp } from "@tscircuit/footprinter"
import { Colorize, Cuboid, Hull, Union, Rotate, Translate } from "jscad-fiber"

/** Bourns MF-SM, Product Dimensions page 3, MF-SM075/60 row.
 * A=7.355, D/E=0.635, F=2.285, G=1.015 mm use tolerance midpoints;
 * B=3.18 and C=5.44 mm use specified maxima, H=0.43 mm minimum.
 * Represents the stacked PTC sandwich and opposed bent terminals.
 * Terminal bends are squared; laminate thickness, color and ink are illustrative.
 * This is an envelope approximation, not a universal model for all MF-SM ratings.
 * https://www.bourns.com/docs/product-datasheets/mf-sm.pdf
 *
 * JLCPCB reference candidates: C210842 (MF-SM075/60-2).
 * Existing placement string: smdpads2_p7.0825mm_pw1.5mm_ph3.1mm_cyw9.0852mm_cyh6.1896mm
 * The footprint supplies only center/orientation. Instantiate this component
 * explicitly; two pads alone cannot identify this package. No automatic routing.
 */
export const MFSM075ResettableFuse = ({
  footprint = "smdpads2_p7.0825mm_pw1.5mm_ph3.1mm_cyw9.0852mm_cyh6.1896mm",
}: { footprint?: string }) => {
  const pads = fp
    .string(footprint)
    .circuitJson()
    .filter(
      (e) =>
        e.type === "pcb_smtpad" &&
        (e.shape === "rect" || e.shape === "rotated_rect"),
    )
  if (pads.length !== 2)
    throw new Error("MFSM075ResettableFuse requires two pads")
  const [a, b] = pads
  const angle = Math.atan2(b!.y - a!.y, b!.x - a!.x)
  return (
    <Translate offset={[(a!.x + b!.x) / 2, (a!.y + b!.y) / 2, 0]}>
      <Rotate rotation={[0, 0, angle]}>
        <Colorize color="#55523d">
          <Cuboid size={[6.085, 5.44, 0.915]} center={[0, 0, 2.0975]} />
        </Colorize>
        <Colorize color="#babcb9">
          <Union>
            <Cuboid size={[6.72, 5.44, 0.635]} center={[0.3175, 0, 2.8625]} />
            <Cuboid size={[0.635, 5.44, 2.75]} center={[-3.36, 0, 1.805]} />
            <Cuboid size={[0.635, 2.285, 0.44]} center={[-3.36, 0, 0.22]} />
          </Union>
          <Union>
            <Cuboid size={[6.72, 5.44, 0.635]} center={[-0.3175, 0, 1.3325]} />
            <Cuboid size={[0.635, 2.285, 1.65]} center={[3.36, 0, 0.825]} />
          </Union>
        </Colorize>
      </Rotate>
    </Translate>
  )
}
