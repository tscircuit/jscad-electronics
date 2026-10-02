import { fp } from "@tscircuit/footprinter"
import { Colorize, Cuboid, Rotate, Translate } from "jscad-fiber"

/** RUILON SMD2920P185TF resettable fuse, C21008. Dimensions are in mm.
 * The 0.7 mm height is the manufacturer's lower specified limit; the
 * available C21008 OBJ is only 0.5 mm high and falls outside that range.
 * https://atta.szlcsc.com/upload/public/pdf/source/20220411/DE5F61489B644A8D8928799A11D43984.pdf
 * https://modelcdn.tscircuit.com/easyeda_models/assets/C21008.obj
 */
export function Smd2920P185TF({
  footprint = "smdpads2_p6.5999mm_pw2mm_ph5.3mm_cyw9.6948mm_cyh6.2912mm",
}: {
  footprint?: string
}) {
  const pads = fp
    .string(footprint)
    .circuitJson()
    .filter(
      (item) =>
        item.type === "pcb_smtpad" &&
        (item.shape === "rect" || item.shape === "rotated_rect"),
    )
  if (pads.length !== 2) throw new Error("Smd2920P185TF requires two pads")
  const [a, b] = pads
  const angle = Math.atan2(b!.y - a!.y, b!.x - a!.x)

  return (
    <Translate offset={[(a!.x + b!.x) / 2, (a!.y + b!.y) / 2, 0]}>
      <Rotate rotation={[0, 0, angle]}>
        <Colorize color="#1d1d1d">
          <Cuboid size={[4.56, 5.08, 0.68]} center={[0, 0, 0.36]} />
        </Colorize>
        <Colorize color="#c0c0c0">
          {[-1, 1].map((side) => (
            <Cuboid
              key={side}
              size={[1.4, 5.12, 0.7]}
              center={[side * 2.98, 0, 0.35]}
            />
          ))}
        </Colorize>
      </Rotate>
    </Translate>
  )
}
