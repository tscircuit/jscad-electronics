import { fp } from "@tscircuit/footprinter"
import { Colorize, Cuboid, Hull, Union, Rotate, Translate } from "jscad-fiber"

/** Diodes DFLS1100, page 5, PowerDI123 option A (unnotched tabs).
 * Typical body 2.8 x 1.78 x 0.98 mm, span 3.7 mm; leads 0.2 mm thick.
 * Lead overhang L=0.45, cathode underside L1=1.35, inset L3=0.2 mm.
 * Mold taper (0.08 mm per side), lower mold edge and stripe are simplified.
 * Cathode/large terminal is at pin 1, independently of the drawing orientation.
 * https://www.diodes.com/datasheet/download/DFLS1100.pdf
 *
 * JLCPCB reference candidates: C107674 (DFLS1100-7).
 * Existing placement string: diode_p2.3749mm_pw1.725mm_ph1.5mm_rounded0
 * The footprint supplies only center/orientation. Instantiate this component
 * explicitly; two pads alone cannot identify this package. No automatic routing.
 */
export const PowerDI123 = ({
  footprint = "diode_p2.3749mm_pw1.725mm_ph1.5mm_rounded0",
}: { footprint?: string }) => {
  const pads = fp
    .string(footprint)
    .circuitJson()
    .filter(
      (e) =>
        e.type === "pcb_smtpad" &&
        (e.shape === "rect" || e.shape === "rotated_rect"),
    )
  if (pads.length !== 2) throw new Error("PowerDI123 requires two pads")
  const [a, b] = pads
  const angle = Math.atan2(b!.y - a!.y, b!.x - a!.x)
  return (
    <Translate offset={[(a!.x + b!.x) / 2, (a!.y + b!.y) / 2, 0]}>
      <Rotate rotation={[0, 0, angle]}>
        <Colorize color="#25272a">
          <Hull>
            <Cuboid size={[2.8, 1.78, 0.04]} center={[0, 0, 0.12]} />
            <Cuboid size={[2.64, 1.62, 0.04]} center={[0, 0, 0.96]} />
          </Hull>
        </Colorize>
        <Colorize color="#c7c9cd">
          <Union>
            <Cuboid size={[0.65, 1, 0.2]} center={[-1.525, 0, 0.1]} />
            <Cuboid size={[1.35, 1.1, 0.2]} center={[-0.725, 0, 0.1]} />
          </Union>
          <Cuboid size={[0.65, 1, 0.2]} center={[1.525, 0, 0.1]} />
        </Colorize>
        <Colorize color="#aaaaa8">
          <Cuboid size={[0.16, 1.52, 0.002]} center={[-1.05, 0, 0.98]} />
        </Colorize>
      </Rotate>
    </Translate>
  )
}
