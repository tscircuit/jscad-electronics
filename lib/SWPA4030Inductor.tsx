import { fp } from "@tscircuit/footprinter"
import { Colorize, Cuboid, Hull, Union, Rotate, Translate } from "jscad-fiber"

/** Sunlord SWPA4030S, Fig. 2 on page 2: A/B/C(max)/D/E/F = 4/4/3/3.3/0.95/2.1 mm.
 * Uses maximum specified height. Core corner transitions, resin profile and metal
 * thickness are simplified; winding is enclosed by the magnetic resin shield.
 * https://www.sunlordinc.com/uploads/files/20221122/SWPA%20series%20of%20SMD%20Power%20Inductor.pdf
 */
/** Standalone model candidate for JLCPCB C83472 (SWPA4030S220MT).
 * Placement example: smdpads2_p3.6002mm_pw1.9mm_ph3.7mm
 * This standard footprint controls placement only; instantiate the component explicitly.
 */
export const SWPA4030Inductor = ({
  footprint = "smdpads2_p3.6002mm_pw1.9mm_ph3.7mm",
}: { footprint?: string }) => {
  const pads = fp
    .string(footprint)
    .circuitJson()
    .filter(
      (e) =>
        e.type === "pcb_smtpad" &&
        (e.shape === "rect" || e.shape === "rotated_rect"),
    )
  if (pads.length !== 2) throw new Error("SWPA4030Inductor requires two pads")
  const [a, b] = pads
  const angle = Math.atan2(b!.y - a!.y, b!.x - a!.x)
  return (
    <Translate offset={[(a!.x + b!.x) / 2, (a!.y + b!.y) / 2, 0]}>
      <Rotate rotation={[0, 0, angle]}>
        <Colorize color="#45474a">
          <Union>
            <Cuboid size={[4, 3.3, 2.95]} center={[0, 0, 1.525]} />
            <Hull>
              <Cuboid size={[2.1, 4, 2.95]} center={[0, 0, 1.525]} />
              <Cuboid size={[2.8, 3.3, 2.95]} center={[0, 0, 1.525]} />
            </Hull>
          </Union>
        </Colorize>
        <Colorize color="#c2b998">
          {[-1, 1].map((side) => (
            <Cuboid
              key={side}
              size={[0.95, 3.3, 0.08]}
              center={[side * 1.525, 0, 0.04]}
              color="#c2b998"
            />
          ))}
        </Colorize>
      </Rotate>
    </Translate>
  )
}
