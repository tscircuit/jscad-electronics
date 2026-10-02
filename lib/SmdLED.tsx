import {
  Colorize,
  Cuboid,
  Hull,
  RoundedCuboid,
  Subtract,
  Translate,
} from "jscad-fiber"

export type SmdLedSize = "0402" | "0603" | "0805"
export type SmdLedVariant = SmdLedSize | "ws2812b4020"

/** SMD LED packages in mm. The 0603 outline follows modelcdn meshes for two
 * Kingbright parts, and the WS2812B-4020 is a four-contact side-view variant.
 * A generic footprint cannot specify lens shape, emitted color, or exact height.
 */
export const smdLedDimensions = {
  "0402": { length: 1, width: 0.5, height: 0.5, terminalLength: 0.2 },
  "0603": { length: 1.62, width: 0.8, height: 0.615, terminalLength: 0.21 },
  "0805": { length: 2, width: 1.25, height: 0.75, terminalLength: 0.35 },
} as const

export function SmdLED({
  footprint,
  color,
}: {
  footprint: SmdLedVariant
  color?: string
}) {
  if (footprint === "ws2812b4020")
    return (
      <>
        <Colorize color="#f0eee7">
          <Subtract>
            <Hull>
              <Cuboid size={[3.98, 0.01, 1.7]} center={[0, -0.85, 1]} />
              <Cuboid size={[3.98, 0.01, 2]} center={[0, 0, 1]} />
              <Cuboid size={[3.98, 0.01, 1.92]} center={[0, 0.85, 1]} />
            </Hull>
            <Hull>
              <Cuboid size={[2.4, 0.01, 1]} center={[0, 0.66, 1]} />
              <Cuboid size={[2.8, 0.01, 1.4]} center={[0, 0.86, 1]} />
            </Hull>
            <Cuboid size={[3.2, 0.85, 0.3]} center={[0, -0.425, 0.15]} />
            <Cuboid size={[3.2, 0.15, 0.7]} center={[0, -0.775, 0.35]} />
          </Subtract>
        </Colorize>
        <Colorize color="#bdbfc1">
          {[-1.275, -0.425, 0.425, 1.275].map((x) => (
            <Cuboid
              key={x}
              size={[0.5, 0.85, 0.13]}
              center={[x, -0.425, 0.065]}
            />
          ))}
        </Colorize>
        <Colorize color={color ?? "#fff2c0"}>
          <Cuboid size={[2.1, 0.001, 0.9]} center={[0, 0.657, 1]} />
        </Colorize>
      </>
    )

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
        <Colorize color={color ?? "#ffe8a0"}>
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
      <Colorize color={color ?? "#ffe8a0"}>
        <Translate z={p.height - apertureHeight / 2}>
          <Cuboid size={[p.length * 0.45, p.width * 0.65, apertureHeight]} />
        </Translate>
      </Colorize>
    </>
  )
}
