import { fp } from "@tscircuit/footprinter"
import { Colorize, Cuboid, Hull, Union, Rotate, Translate } from "jscad-fiber"

/** onsemi case 152AF, page 5: nominal 0.62 x 0.32 x 0.29 mm, pitch 0.355 mm.
 * Nominal terminals 0.20 x 0.25 mm; pin 1 has the two 0.05 mm corner cuts.
 * Standoff uses the 0.025 mm tolerance midpoint; ink stripe is illustrative.
 * https://www.onsemi.com/download/data-sheet/pdf/esd8472-d.pdf
 *
 * JLCPCB reference candidates: C133346 (ESD8472MUT5G).
 * Existing placement string: smdpads2_p0.4mm_pw0.2mm_ph0.3mm
 * The footprint supplies only center/orientation. Instantiate this component
 * explicitly; two pads alone cannot identify this package. No automatic routing.
 */
export const X3DFN2 = ({
  footprint = "smdpads2_p0.4mm_pw0.2mm_ph0.3mm",
}: { footprint?: string }) => {
  const pads = fp
    .string(footprint)
    .circuitJson()
    .filter(
      (e) =>
        e.type === "pcb_smtpad" &&
        (e.shape === "rect" || e.shape === "rotated_rect"),
    )
  if (pads.length !== 2) throw new Error("X3DFN2 requires two pads")
  const [a, b] = pads
  const angle = Math.atan2(b!.y - a!.y, b!.x - a!.x)
  return (
    <Translate offset={[(a!.x + b!.x) / 2, (a!.y + b!.y) / 2, 0]}>
      <Rotate rotation={[0, 0, angle]}>
        <Colorize color="#25272a">
          <Cuboid size={[0.62, 0.32, 0.265]} center={[0, 0, 0.1575]} />
        </Colorize>
        <Colorize color="#c7c9cd">
          <Hull>
            <Cuboid size={[0.15, 0.25, 0.05]} center={[-0.1525, 0, 0.025]} />
            <Cuboid size={[0.2, 0.15, 0.05]} center={[-0.1775, 0, 0.025]} />
          </Hull>
          <Cuboid size={[0.2, 0.25, 0.05]} center={[0.1775, 0, 0.025]} />
        </Colorize>
        <Colorize color="#969997">
          <Cuboid size={[0.035, 0.25, 0.002]} center={[-0.25, 0, 0.29]} />
        </Colorize>
      </Rotate>
    </Translate>
  )
}
