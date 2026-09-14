import { fp } from "@tscircuit/footprinter"
import {
  Colorize,
  Cuboid,
  Cylinder,
  Subtract,
  Rotate,
  Translate,
} from "jscad-fiber"

/** AEM MF2410F1.000TM: L/W/T/B = 6.10/2.49/2.16/1.35 mm, marking E.
 * End recess radius (0.3 mm), ink and plating thickness are visual approximations.
 * https://aemcomponents.media.zestyio.com/AEM-MF2410.pdf
 */
export const MF2410Fuse = ({
  footprint = "smdpads2_p4.9997mm_pw2mm_ph3.2mm",
}: { footprint?: string }) => {
  const pads = fp
    .string(footprint)
    .circuitJson()
    .filter(
      (e) =>
        e.type === "pcb_smtpad" &&
        (e.shape === "rect" || e.shape === "rotated_rect"),
    )
  if (pads.length !== 2) throw new Error("MF2410Fuse requires two pads")
  const [a, b] = pads
  const angle = Math.atan2(b!.y - a!.y, b!.x - a!.x)
  return (
    <Translate offset={[(a!.x + b!.x) / 2, (a!.y + b!.y) / 2, 0]}>
      <Rotate rotation={[0, 0, angle]}>
        <Cuboid
          size={[3.42, 2.47, 2.14]}
          center={[0, 0, 1.08]}
          color="#834731"
        />
        {[-1, 1].map((side) => (
          <Colorize key={side} color="#bdc0c2">
            <Subtract>
              <Cuboid
                size={[1.35, 2.49, 2.16]}
                center={[side * 2.375, 0, 1.08]}
              />
              <Cylinder
                radius={0.3}
                height={2.2}
                center={[side * 3.05, 0, 1.08]}
              />
            </Subtract>
          </Colorize>
        ))}
        {/* The datasheet identifies the 1 A rating with the letter E. */}
        <Cuboid
          size={[0.15, 0.9, 0.02]}
          center={[-0.3, 0, 2.15]}
          color="#202020"
        />
        {[-1, 0, 1].map((row) => (
          <Cuboid
            key={row}
            size={[0.65, 0.13, 0.02]}
            center={[0, row * 0.4, 2.15]}
            color="#202020"
          />
        ))}
      </Rotate>
    </Translate>
  )
}
