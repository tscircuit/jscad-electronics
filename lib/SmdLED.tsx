import { Colorize, Cuboid, RoundedCuboid, Translate } from "jscad-fiber"

export type SmdLedSize = "0402" | "0603" | "0805"

/** Flat-top, two-contact LED packages in mm. The 0603 outline follows
 * modelcdn meshes for two Kingbright parts; other sizes use catalog dimensions.
 * A footprint alone cannot specify lens shape, emitted color, or exact height.
 */
export const smdLedDimensions = {
  "0402": { length: 1, width: 0.5, height: 0.5, terminalLength: 0.2 },
  "0603": { length: 1.62, width: 0.8, height: 0.615, terminalLength: 0.21 },
  "0805": { length: 2, width: 1.25, height: 0.75, terminalLength: 0.35 },
} as const

export function SmdLED({
  footprint,
  color = "#ffe8a0",
}: {
  footprint: SmdLedSize
  color?: string
}) {
  const p = smdLedDimensions[footprint]
  if (footprint === "0603")
    return (
      <>
        <Colorize color="#f0eee7">
          <RoundedCuboid
            size={[1.2, 0.79, 0.6]}
            roundRadius={0.02}
            center={[0, 0, 0.31]}
          />
        </Colorize>
        <Colorize color="#c7c9ca">
          {[-1, 1].map((sign) => (
            <Cuboid
              key={sign}
              size={[0.21, 0.8, 0.22]}
              center={[sign * 0.705, 0, 0.11]}
            />
          ))}
        </Colorize>
        <Colorize color={color}>
          <Cuboid size={[0.72, 0.52, 0.01]} center={[0, 0, 0.61]} />
        </Colorize>
      </>
    )
  const terminalThickness = Math.min(0.1, p.height / 4)
  const apertureHeight = 0.02
  return (
    <>
      <Colorize color="#f0eee7">
        <Translate z={(p.height + terminalThickness - apertureHeight) / 2}>
          <Cuboid
            size={[
              p.length,
              p.width,
              p.height - terminalThickness - apertureHeight,
            ]}
          />
        </Translate>
      </Colorize>
      <Colorize color="#c7c9ca">
        {[-1, 1].map((sign) => (
          <Translate
            key={sign}
            offset={[
              (sign * (p.length - p.terminalLength)) / 2,
              0,
              terminalThickness / 2,
            ]}
          >
            <Cuboid size={[p.terminalLength, p.width, terminalThickness]} />
          </Translate>
        ))}
      </Colorize>
      <Colorize color={color}>
        <Translate z={p.height - apertureHeight / 2}>
          <Cuboid size={[p.length * 0.45, p.width * 0.65, apertureHeight]} />
        </Translate>
      </Colorize>
    </>
  )
}
