import { fp } from "@tscircuit/footprinter"
import { Cuboid, Rotate, Translate } from "jscad-fiber"

/** Walsin RFANT5220110A0T outer geometry, L/W/T/A = 5.2/2/1.15/0.4 mm.
 * Source: ASC_RFANT5220110A0T_V15, page 2. Pad 1 is the feed end.
 * https://www.allelcoelec.nl/datasheets.1c/RFANT5220110A0T.pdf
 */
export const CeramicChipAntenna = ({
  footprint = "smdpads2_p5.4mm_pw1mm_ph2mm",
}: { footprint?: string }) => {
  const pads = fp
    .string(footprint)
    .circuitJson()
    .filter(
      (e) =>
        e.type === "pcb_smtpad" &&
        (e.shape === "rect" || e.shape === "rotated_rect"),
    )
  if (pads.length !== 2) throw new Error("CeramicChipAntenna requires two pads")
  const [a, b] = pads
  const angle = Math.atan2(b!.y - a!.y, b!.x - a!.x)
  return (
    <Translate offset={[(a!.x + b!.x) / 2, (a!.y + b!.y) / 2, 0]}>
      <Rotate rotation={[0, 0, angle]}>
        <Cuboid size={[4.44, 1.99, 1.14]} center={[0, 0, 0.575]} color="#4053a3" />
        {[-1, 1].map((side) => (
          <Cuboid
            key={side}
            size={[0.4, 2, 1.15]}
            center={[side * 2.4, 0, 0.575]}
            color="#c2c4c7"
          />
        ))}
        {/* Identification patch on the top by the feed end; it is not a third pad. */}
        <Cuboid
          size={[0.9, 2, 0.01]}
          center={[-1.75, 0, 1.145]}
          color="#b1b3b6"
        />
      </Rotate>
    </Translate>
  )
}
