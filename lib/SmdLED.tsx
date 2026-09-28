import { Colorize, Cuboid, Translate } from "jscad-fiber"

export type SmdLedSize = "0402" | "0603" | "0805"

/** Nominal flat-top, two-contact LED packages in mm. See the Kingbright
 * package catalog: https://www.kingbrightusa.com/webimages/2015/catalog/SMD%20LED.pdf
 * These are representative outlines; a footprint alone cannot specify lens
 * shape, emitted color, or exact height for every manufacturer's part.
 */
export const smdLedDimensions = {
  "0402": { length: 1, width: 0.5, height: 0.5, terminalLength: 0.2 },
  "0603": { length: 1.6, width: 0.8, height: 0.75, terminalLength: 0.3 },
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
