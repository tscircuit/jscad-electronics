import { fp } from "@tscircuit/footprinter"
import { Colorize, Cuboid, Hull, Union, Rotate, Translate } from "jscad-fiber"

/** Vishay MSS1P3/MSS1P4, page 3, DO-219AD: midpoint body 2.2 x 1.3 mm,
 * height 0.68 mm, total span 2.5 mm, lead thickness 0.195 mm.
 * Unequal bottom terminals: cathode 1.3 x 0.88, anode 0.65 x 0.65 mm.
 * Mold taper (0.05 mm per side) and cathode stripe are visual approximations.
 * https://www.vishay.com/doc/?89019=
 *
 * JLCPCB reference candidates: C2980309 (MSS1P4-M3/89A).
 * Existing placement string: smdpads2_p1.84mm_pw1.35mm_ph0.95mm
 * The footprint supplies only center/orientation. Instantiate this component
 * explicitly; two pads alone cannot identify this package. No automatic routing.
 */
export const MicroSMP = ({
  footprint = "smdpads2_p1.84mm_pw1.35mm_ph0.95mm",
}: { footprint?: string }) => {
  const pads = fp
    .string(footprint)
    .circuitJson()
    .filter(
      (e) =>
        e.type === "pcb_smtpad" &&
        (e.shape === "rect" || e.shape === "rotated_rect"),
    )
  if (pads.length !== 2) throw new Error("MicroSMP requires two pads")
  const [a, b] = pads
  const angle = Math.atan2(b!.y - a!.y, b!.x - a!.x)
  return (
    <Translate offset={[(a!.x + b!.x) / 2, (a!.y + b!.y) / 2, 0]}>
      <Rotate rotation={[0, 0, angle]}>
        <Colorize color="#25272a">
          <Hull>
            <Cuboid size={[2.2, 1.3, 0.02]} center={[0, 0, 0.12]} />
            <Cuboid size={[2.1, 1.2, 0.02]} center={[0, 0, 0.67]} />
          </Hull>
        </Colorize>
        <Colorize color="#c7c9cd">
          <Cuboid size={[1.3, 0.88, 0.195]} center={[-0.6, 0, 0.0975]} />
          <Cuboid size={[0.65, 0.65, 0.195]} center={[0.925, 0, 0.0975]} />
        </Colorize>
        <Colorize color="#aaaaa8">
          <Cuboid size={[0.23, 1.1, 0.002]} center={[-0.83, 0, 0.68]} />
        </Colorize>
      </Rotate>
    </Translate>
  )
}
