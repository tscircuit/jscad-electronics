import { fp } from "@tscircuit/footprinter"
import {
  Colorize,
  Cuboid,
  Cylinder,
  RoundedCuboid,
  Rotate,
  Translate,
} from "jscad-fiber"

/** Omron B3U-1000P (no ground terminal, no boss), drawing on page 2.
 * Body 3 x 2.5 x 1.2 mm; actuator diameter 1.5, total height 1.6, terminal span 4.
 * Cover/base thicknesses and retaining tabs approximate the un-dimensioned enclosure.
 * https://omronfs.omron.com/en_US/ecb/products/pdf/en-b3u.pdf
 */
export const B3UTactileSwitch = ({
  footprint = "smdpads2_p3.4mm_pw0.8mm_ph1.7mm",
}: { footprint?: string }) => {
  const pads = fp
    .string(footprint)
    .circuitJson()
    .filter(
      (e) =>
        e.type === "pcb_smtpad" &&
        (e.shape === "rect" || e.shape === "rotated_rect"),
    )
  if (pads.length !== 2) throw new Error("B3UTactileSwitch requires two pads")
  const [a, b] = pads
  const angle = Math.atan2(b!.y - a!.y, b!.x - a!.x)
  return (
    <Translate offset={[(a!.x + b!.x) / 2, (a!.y + b!.y) / 2, 0]}>
      <Rotate rotation={[0, 0, angle]}>
        <Cuboid
          size={[2.98, 2.48, 1.02]}
          center={[0, 0, 0.61]}
          color="#353535"
        />
        <Colorize color="#bdc1c5">
          <RoundedCuboid
            size={[3, 2.5, 0.2]}
            roundRadius={0.04}
            center={[0, 0, 1.1]}
          />
        </Colorize>
        <Cylinder
          radius={0.75}
          height={0.5}
          center={[0, 0, 1.35]}
          color="#202020"
        />
        <Colorize color="#bcc0c4">
          {[-1, 1].map((side) => (
            <Cuboid
              key={side}
              size={[0.7, 1.4, 0.16]}
              center={[side * 1.65, 0, 0.08]}
              color="#bcc0c4"
            />
          ))}
        </Colorize>
        <Colorize color="#bdc1c5">
          {[-1, 1].map((side) => (
            <Cuboid
              key={side}
              size={[1.8, 0.12, 0.6]}
              center={[0, side * 1.19, 0.8]}
              color="#bdc1c5"
            />
          ))}
        </Colorize>
      </Rotate>
    </Translate>
  )
}
