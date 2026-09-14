import { fp } from "@tscircuit/footprinter"
import { Colorize, Cylinder, Rotate, Translate } from "jscad-fiber"

// Vishay MMU/MMA/MMB nominal L, D, K in mm: https://www.vishay.com/doc?28713=
export const melfResistorSizes = {
  "0102": [2.2, 1.1, 0.4],
  "0204": [3.6, 1.4, 0.75],
  "0207": [5.8, 2.2, 1.15],
} as const
export type MelfResistorSize = keyof typeof melfResistorSizes

/** Cylindrical resistor with end caps; no diode polarity band or inferred value. */
export const MelfResistor = ({
  size = "0204",
  footprint = "smdpads2_p2.8mm_pw1.2mm_ph1.6mm",
}: { size?: MelfResistorSize; footprint?: string }) => {
  const dims = melfResistorSizes[size]
  if (!dims) throw new Error("Unsupported MELF resistor size")
  const [length, diameter, capLength] = dims
  const pads = fp
    .string(footprint)
    .circuitJson()
    .filter(
      (e) =>
        e.type === "pcb_smtpad" &&
        (e.shape === "rect" || e.shape === "rotated_rect"),
    )
  if (pads.length !== 2) throw new Error("MelfResistor requires two pads")
  const [a, b] = pads
  const angle = Math.atan2(b!.y - a!.y, b!.x - a!.x)
  return (
    <Translate offset={[(a!.x + b!.x) / 2, (a!.y + b!.y) / 2, diameter / 2]}>
      <Rotate rotation={[0, 0, angle]}>
        <Rotate rotation={[0, Math.PI / 2, 0]}>
          <Colorize color="#426d63">
            <Cylinder
              radius={(diameter - 0.08) / 2}
              height={length - 2 * capLength + 0.04}
            />
          </Colorize>
          <Colorize color="#c6c8cb">
            {[-1, 1].map((side) => (
              <Cylinder
                key={side}
                radius={diameter / 2}
                height={capLength}
                center={[0, 0, (side * (length - capLength)) / 2]}
              />
            ))}
          </Colorize>
        </Rotate>
      </Rotate>
    </Translate>
  )
}
