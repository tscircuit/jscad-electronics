import { fp } from "@tscircuit/footprinter"
import { Colorize, Cuboid, Hull, Rotate, Translate, Union } from "jscad-fiber"

// KYOCERA AVX TAJ standard cases, nominal L/W/H/W1/A (mm):
// https://datasheets.kyocera-avx.com/TAJ.pdf
export const tantalumCases = {
  A: [3.2, 1.6, 1.6, 1.2, 0.8],
  B: [3.5, 2.8, 1.9, 2.2, 0.8],
  C: [6, 3.2, 2.6, 2.2, 1.3],
  D: [7.3, 4.3, 2.9, 2.4, 1.3],
} as const
export type TantalumCase = keyof typeof tantalumCases

/** Explicit case identity is required; copper dimensions do not determine height. */
export const TantalumCapacitor = ({
  caseSize = "A",
  footprint = "smdpads2_p3.1mm_pw1.4mm_ph1.6mm",
}: { caseSize?: TantalumCase; footprint?: string }) => {
  const dims = tantalumCases[caseSize]
  if (!dims) throw new Error("Unsupported tantalum case")
  const [length, width, height, leadWidth, leadLength] = dims
  const pads = fp
    .string(footprint)
    .circuitJson()
    .filter((e) => e.type === "pcb_smtpad")
  if (pads.length !== 2) throw new Error("TantalumCapacitor requires two pads")
  const [a, b] = pads
  const angle = Math.atan2(b!.y - a!.y, b!.x - a!.x)
  return (
    <Translate offset={[(a!.x + b!.x) / 2, (a!.y + b!.y) / 2, 0]}>
      <Rotate rotation={[0, 0, angle]}>
        <Colorize color="#d5a64e">
          <Hull>
            <Cuboid size={[length - 0.1, width, 0.02]} center={[0, 0, 0.21]} />
            <Cuboid
              size={[length - 0.25, width - 0.15, 0.02]}
              center={[0, 0, height - 0.01]}
            />
          </Hull>
        </Colorize>
        <Colorize color="#c5c8cb">
          {[-1, 1].map((side) => (
            <Union key={side}>
              <Cuboid
                size={[leadLength, leadWidth, 0.25]}
                center={[(side * (length - leadLength)) / 2, 0, 0.125]}
              />
              <Cuboid
                size={[0.15, leadWidth, height * 0.45]}
                center={[(side * (length - 0.15)) / 2, 0, height * 0.225]}
              />
            </Union>
          ))}
        </Colorize>
        {/* Positive terminal stripe at pad 1, printed directly on the top face. */}
        <Cuboid
          size={[0.25, width - 0.25, 0.01]}
          center={[-length / 2 + 0.5, 0, height]}
          color="#423426"
        />
      </Rotate>
    </Translate>
  )
}
