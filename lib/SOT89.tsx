import { Colorize, Cuboid, Translate, Hull, Union } from "jscad-fiber"
/** Three-terminal SOT-89 / TO-243 / SC-62, in mm. Three flat leads at -X;
 * the middle terminal continues into the exposed die pad and rear tab at +X.
 * Body dimensions exclude metal. Z=0 is the seating plane. Mold draft is an
 * approximation; tab corner chamfers and lead-frame stamping details are omitted.
 */
export interface SOT89Props {
  bodyWidth: number
  bodyLength: number
  bodyHeight: number
  standoff: number
  pitch: number
  leadWidth: number
  centerLeadWidth: number
  leadLength: number
  terminalThickness: number
  tabWidth: number
  tabLength: number
  rearExtension: number
  taperInset: number
}
export function SOT89(p: SOT89Props) {
  for (const k of [
    "bodyWidth",
    "bodyLength",
    "bodyHeight",
    "pitch",
    "leadWidth",
    "centerLeadWidth",
    "leadLength",
    "terminalThickness",
    "tabWidth",
    "tabLength",
    "rearExtension",
  ] as const)
    if (!Number.isFinite(p[k]) || p[k] <= 0)
      throw new Error(`${k} must be finite and positive`)
  if (
    !Number.isFinite(p.standoff) ||
    p.standoff < 0 ||
    !Number.isFinite(p.taperInset) ||
    p.taperInset < 0 ||
    p.terminalThickness <= p.standoff ||
    p.terminalThickness >= p.bodyHeight ||
    2 * p.pitch + p.leadWidth >= p.bodyLength ||
    p.leadWidth >= p.pitch ||
    p.centerLeadWidth >= p.pitch ||
    p.tabWidth >= 2 * p.pitch - p.leadWidth ||
    p.tabWidth <= p.centerLeadWidth ||
    p.tabLength <= p.rearExtension ||
    p.tabLength >= p.bodyWidth + p.rearExtension ||
    2 * p.taperInset >= Math.min(p.bodyWidth, p.bodyLength)
  )
    throw new Error("Invalid SOT-89 body or terminal layout")
  const front = -p.bodyWidth / 2,
    rear = p.bodyWidth / 2 + p.rearExtension,
    tabFront = rear - p.tabLength
  const slice = Math.min(0.002, (p.bodyHeight - p.standoff) / 100)
  const block = (x: number, y: number, length: number, width: number) => (
    <Translate offset={[x, y, p.terminalThickness / 2]}>
      <Cuboid size={[length, width, p.terminalThickness]} />
    </Translate>
  )
  return (
    <>
      <Colorize color="#353535">
        <Hull>
          <Translate z={p.standoff + slice / 2}>
            <Cuboid size={[p.bodyWidth, p.bodyLength, slice]} />
          </Translate>
          <Translate z={p.bodyHeight - slice / 2}>
            <Cuboid
              size={[
                p.bodyWidth - 2 * p.taperInset,
                p.bodyLength - 2 * p.taperInset,
                slice,
              ]}
            />
          </Translate>
        </Hull>
      </Colorize>
      <Colorize color="#bfc1c4">
        {[-1, 1].map((sign) =>
          block(
            front - p.leadLength / 2 + 0.125,
            sign * p.pitch,
            p.leadLength + 0.25,
            p.leadWidth,
          ),
        )}
      </Colorize>
      <Colorize color="#bfc1c4">
        <Union>
          {block(
            (front - p.leadLength + tabFront + 0.15) / 2,
            0,
            tabFront + 0.15 - front + p.leadLength,
            p.centerLeadWidth,
          )}
          {block(rear - p.tabLength / 2, 0, p.tabLength, p.tabWidth)}
        </Union>
      </Colorize>
    </>
  )
}

/** Nominal three-terminal TO-243/SC-62 dimensions. Copper land adjustments
 * do not resize the physical package. See the standard fixture for sources. */
export const sot89NominalDimensions = {
  bodyWidth: 2.5,
  bodyLength: 4.5,
  bodyHeight: 1.5,
  standoff: 0.02,
  pitch: 1.5,
  leadWidth: 0.415,
  centerLeadWidth: 0.465,
  leadLength: 1,
  terminalThickness: 0.335,
  tabWidth: 1.6,
  tabLength: 2.4,
  rearExtension: 0.5,
  taperInset: 0.15,
} satisfies SOT89Props
