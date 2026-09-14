import { Colorize, Cuboid, Translate, Union } from "jscad-fiber"
/** Flat three-terminal TO-277A outline, in mm. The broad cathode is at +X;
 * two anode contacts are at -X. Body dimensions exclude the metal frame.
 * No solder or footprint dimensions are consumed. Rounded mold edges and
 * terminal corner radii are simplified; the stepped cathode outline is retained.
 */
export interface TO277Props {
  bodyWidth: number
  bodyLength: number
  bodyHeight: number
  terminalThickness: number
  terminalSpan: number
  leadWidth: number
  leadLength: number
  pitch: number
  tabLength: number
  tabWidth: number
  tabNeckWidth: number
  tabNeckLength: number
  tabBarWidth: number
  tabBarLength: number
}
export function TO277(p: TO277Props) {
  for (const k of [
    "bodyWidth",
    "bodyLength",
    "bodyHeight",
    "terminalThickness",
    "terminalSpan",
    "leadWidth",
    "leadLength",
    "pitch",
    "tabLength",
    "tabWidth",
    "tabNeckWidth",
    "tabNeckLength",
    "tabBarWidth",
    "tabBarLength",
  ] as const)
    if (!Number.isFinite(p[k]) || p[k] <= 0)
      throw new Error(`${k} must be finite and positive`)
  const rear = p.terminalSpan / 2,
    front = -rear,
    tabFront = rear - p.tabLength
  if (
    p.terminalThickness >= p.bodyHeight ||
    p.terminalSpan < p.bodyWidth ||
    p.pitch + p.leadWidth >= p.bodyLength ||
    p.leadWidth >= p.pitch ||
    front + p.leadLength >= tabFront ||
    front + p.leadLength <= -p.bodyWidth / 2 ||
    tabFront >= p.bodyWidth / 2 ||
    p.tabNeckWidth > p.tabWidth ||
    p.tabWidth > p.bodyLength ||
    p.tabBarWidth < p.tabWidth ||
    p.tabNeckLength + p.tabBarLength >= p.tabLength
  )
    throw new Error("Invalid TO-277 terminal geometry or clearance")
  const block = (x: number, y: number, length: number, width: number) => (
    <Translate offset={[x, y, p.terminalThickness / 2]}>
      <Cuboid size={[length, width, p.terminalThickness]} />
    </Translate>
  )
  return (
    <>
      <Colorize color="#353535">
        <Translate z={(p.bodyHeight + p.terminalThickness / 2) / 2}>
          <Cuboid
            size={[
              p.bodyWidth,
              p.bodyLength,
              p.bodyHeight - p.terminalThickness / 2,
            ]}
          />
        </Translate>
      </Colorize>
      <Colorize color="#bfc1c4">
        {[-1, 1].map((sign) =>
          block(
            front + p.leadLength / 2,
            (sign * p.pitch) / 2,
            p.leadLength,
            p.leadWidth,
          ),
        )}
      </Colorize>
      <Colorize color="#bfc1c4">
        <Union>
          {block(
            tabFront + (p.tabLength - p.tabNeckLength) / 2,
            0,
            p.tabLength - p.tabNeckLength,
            p.tabWidth,
          )}
          {block(
            rear - p.tabNeckLength / 2 - 0.01,
            0,
            p.tabNeckLength + 0.02,
            p.tabNeckWidth,
          )}
          {block(
            tabFront + p.tabBarLength / 2,
            0,
            p.tabBarLength,
            p.tabBarWidth,
          )}
        </Union>
      </Colorize>
    </>
  )
}
