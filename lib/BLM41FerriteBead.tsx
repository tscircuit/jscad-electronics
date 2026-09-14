import { fp } from "@tscircuit/footprinter"
import { Colorize, Cuboid, Rotate, Translate } from "jscad-fiber"

/** Murata BLM41PG600SN1: 4.5 x 1.6 x 1.6 mm; termination length 0.7 mm.
 * End-cap plating thickness is visually approximated at 0.01 mm.
 * https://www.murata.com/en-global/products/productdetail?partno=BLM41PG600SN1L
 */
export const BLM41FerriteBead = ({
  footprint = "smdpads2_p3.8999mm_pw2mm_ph2mm",
}: { footprint?: string }) => {
  const pads = fp
    .string(footprint)
    .circuitJson()
    .filter(
      (e) =>
        e.type === "pcb_smtpad" &&
        (e.shape === "rect" || e.shape === "rotated_rect"),
    )
  if (pads.length !== 2) throw new Error("BLM41FerriteBead requires two pads")
  const [a, b] = pads
  const angle = Math.atan2(b!.y - a!.y, b!.x - a!.x)
  return (
    <Translate offset={[(a!.x + b!.x) / 2, (a!.y + b!.y) / 2, 0]}>
      <Rotate rotation={[0, 0, angle]}>
        <Cuboid
          size={[3.12, 1.58, 1.58]}
          center={[0, 0, 0.8]}
          color="#373b3e"
        />
        <Colorize color="#b9bdc0">
          {[-1, 1].map((side) => (
            <Cuboid
              key={side}
              size={[0.7, 1.6, 1.6]}
              center={[side * 1.9, 0, 0.8]}
              color="#b9bdc0"
            />
          ))}
        </Colorize>
      </Rotate>
    </Translate>
  )
}
