import { fp } from "@tscircuit/footprinter"
import { Colorize, Cuboid, Hull, Union, Rotate, Translate } from "jscad-fiber"

/** TI DPY0002A, page 19: 1.0 x 0.6 mm body, 0.65 mm terminal pitch.
 * Height 0.375 mm and standoff 0.025 mm use tolerance midpoints.
 * Terminals are 0.25 x 0.50 mm; optional terminal chamfer omitted.
 * The pin-1 ink stripe is illustrative; exposed leadframe side windows are omitted.
 * https://www.ti.com/lit/ds/symlink/tpd1e10b06.pdf
 *
 * JLCPCB reference candidates: C48260 (TPD1E10B06DPYR), C436349 (TPD1E05U06DPYR).
 * Existing placement string: smdpads2_p1mm_pw0.6mm_ph0.6mm
 * The footprint supplies only center/orientation. Instantiate this component
 * explicitly; two pads alone cannot identify this package. No automatic routing.
 */
export const X1SON2 = ({
  footprint = "smdpads2_p1mm_pw0.6mm_ph0.6mm",
}: { footprint?: string }) => {
  const pads = fp
    .string(footprint)
    .circuitJson()
    .filter(
      (e) =>
        e.type === "pcb_smtpad" &&
        (e.shape === "rect" || e.shape === "rotated_rect"),
    )
  if (pads.length !== 2) throw new Error("X1SON2 requires two pads")
  const [a, b] = pads
  const angle = Math.atan2(b!.y - a!.y, b!.x - a!.x)
  return (
    <Translate offset={[(a!.x + b!.x) / 2, (a!.y + b!.y) / 2, 0]}>
      <Rotate rotation={[0, 0, angle]}>
        <Colorize color="#25272a">
          <Cuboid size={[1, 0.6, 0.35]} center={[0, 0, 0.2]} />
        </Colorize>
        <Colorize color="#c7c9cd">
          {[-1, 1].map((side) => (
            <Cuboid
              key={side}
              size={[0.25, 0.5, 0.05]}
              center={[side * 0.325, 0, 0.025]}
            />
          ))}
        </Colorize>
        <Colorize color="#969997">
          <Cuboid size={[0.07, 0.5, 0.002]} center={[-0.39, 0, 0.375]} />
        </Colorize>
      </Rotate>
    </Translate>
  )
}
