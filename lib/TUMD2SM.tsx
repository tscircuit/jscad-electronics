import { fp } from "@tscircuit/footprinter"
import { Colorize, Cuboid, Hull, Union, Rotate, Translate } from "jscad-fiber"

/** ROHM RFU02VSM6S, page 1: body 2.0 x 1.4 mm, total span 2.5 mm,
 * nominal height 0.60 mm, terminal width 0.80 mm and thickness 0.17 mm.
 * Uses 0.05 mm standoff. Mold taper (0.15 mm per side), buried lead length
 * and the cathode stripe are visual approximations; date/lot ink is omitted.
 * https://www.es.co.th/Schemetic/PDF/RFU02VSM6S.PDF
 *
 * JLCPCB reference candidates: C509976 (RFU02VSM6STR).
 * Existing placement string: smdpads2_p2.1001mm_pw0.8mm_ph1.1mm
 * The footprint supplies only center/orientation. Instantiate this component
 * explicitly; two pads alone cannot identify this package. No automatic routing.
 */
export const TUMD2SM = ({
  footprint = "smdpads2_p2.1001mm_pw0.8mm_ph1.1mm",
}: { footprint?: string }) => {
  const pads = fp
    .string(footprint)
    .circuitJson()
    .filter(
      (e) =>
        e.type === "pcb_smtpad" &&
        (e.shape === "rect" || e.shape === "rotated_rect"),
    )
  if (pads.length !== 2) throw new Error("TUMD2SM requires two pads")
  const [a, b] = pads
  const angle = Math.atan2(b!.y - a!.y, b!.x - a!.x)
  return (
    <Translate offset={[(a!.x + b!.x) / 2, (a!.y + b!.y) / 2, 0]}>
      <Rotate rotation={[0, 0, angle]}>
        <Colorize color="#25272a">
          <Hull>
            <Cuboid size={[2, 1.4, 0.04]} center={[0, 0, 0.07]} />
            <Cuboid size={[1.7, 1.1, 0.04]} center={[0, 0, 0.58]} />
          </Hull>
        </Colorize>
        <Colorize color="#c7c9cd">
          {[-1, 1].map((side) => (
            <Cuboid
              key={side}
              size={[0.55, 0.8, 0.17]}
              center={[side * 0.975, 0, 0.085]}
            />
          ))}
        </Colorize>
        <Colorize color="#aaaaa8">
          <Cuboid size={[0.2, 1.04, 0.002]} center={[-0.72, 0, 0.6]} />
        </Colorize>
      </Rotate>
    </Translate>
  )
}
