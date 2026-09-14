import { fp } from "@tscircuit/footprinter"
import { Colorize, Cuboid, RoundedCuboid, Rotate, Translate } from "jscad-fiber"

// Manufacturer outlines, L/W/H in mm:
// https://www.epson.com.cn/ed/search/prod-search.html
// https://www.ndk.com/en/products/lineup/crystal-unit/NX3225GD.html
export const twoPadCrystalPackages = {
  FC135: [3.2, 1.5, 0.9, 0.7],
  FC12M: [2.05, 1.2, 0.6, 0.5],
  FC1610AN: [1.65, 1.05, 0.5, 0.4],
  NX3225GD: [3.2, 2.5, 0.8, 1.2],
} as const
export type TwoPadCrystalPackage = keyof typeof twoPadCrystalPackages
/** Two-terminal ceramic crystal enclosure. Package identity is explicitly supplied. */
export const TwoPadCrystal = ({
  packageName = "FC135",
  footprint = "smdpads2_p2.5mm_pw1mm_ph1.8mm",
}: { packageName?: TwoPadCrystalPackage; footprint?: string }) => {
  const dims = twoPadCrystalPackages[packageName]
  if (!dims) throw new Error("Unsupported two-pad crystal package")
  const [length, width, height, terminalLength] = dims
  const pads = fp
    .string(footprint)
    .circuitJson()
    .filter(
      (e) =>
        e.type === "pcb_smtpad" &&
        (e.shape === "rect" || e.shape === "rotated_rect"),
    )
  if (pads.length !== 2) throw new Error("TwoPadCrystal requires two pads")
  const [a, b] = pads
  const angle = Math.atan2(b!.y - a!.y, b!.x - a!.x)
  return (
    <Translate offset={[(a!.x + b!.x) / 2, (a!.y + b!.y) / 2, 0]}>
      <Rotate rotation={[0, 0, angle]}>
        <Colorize color="#e0dcca">
          <Cuboid size={[length, width, 0.2]} center={[0, 0, 0.13]} />
        </Colorize>
        <Colorize color="#acb1b8">
          <RoundedCuboid
            size={[length - 0.04, width - 0.04, height - 0.18]}
            roundRadius={0.035}
            center={[0, 0, (height + 0.18) / 2]}
          />
        </Colorize>
        <Colorize color="#c6af65">
          {[-1, 1].map((side) => (
            <Cuboid
              key={side}
              size={[terminalLength, width - 0.12, 0.06]}
              center={[(side * (length - terminalLength)) / 2, 0, 0.03]}
            />
          ))}
        </Colorize>
      </Rotate>
    </Translate>
  )
}
