import { Colorize, Cuboid, Hull, Subtract } from "jscad-fiber"

/** Physical outline dimensions in mm, independent of a PCB land pattern. */
export interface FlatLeadDiodeDimensions {
  bodyLength: number
  bodyWidth: number
  /** Overall height from the seating plane, including standoff. */
  bodyHeight: number
  /** Outer tip-to-tip span of the two terminals. */
  leadSpan: number
  cathodeLength: number
  cathodeWidth: number
  anodeLength: number
  anodeWidth: number
  terminalThickness: number
  standoff: number
  /** Inset of each top edge relative to the mold base. */
  taperInset: number
  /** Top cathode band width; zero omits the band. */
  markingWidth: number
}

/** Shared geometry for flat-lead diode outlines; standard wrappers supply defaults.
 * Cathode is at negative X. All dimensions remain physical; no footprint inference.
 */
export function createFlatLeadDiode(p: FlatLeadDiodeDimensions) {
  for (const [name, value] of Object.entries(p)) {
    const allowZero = ["standoff", "taperInset", "markingWidth"].includes(name)
    if (!Number.isFinite(value) || (allowZero ? value < 0 : value <= 0))
      throw new Error(`Invalid diode dimension: ${name}`)
  }
  const overhang = (p.leadSpan - p.bodyLength) / 2
  if (
    overhang < 0 ||
    p.cathodeLength <= overhang ||
    p.anodeLength <= overhang ||
    p.cathodeLength + p.anodeLength >= p.leadSpan ||
    p.cathodeWidth > p.bodyWidth ||
    p.anodeWidth > p.bodyWidth ||
    p.standoff >= p.terminalThickness ||
    p.terminalThickness >= p.bodyHeight ||
    p.taperInset * 2 >= Math.min(p.bodyLength, p.bodyWidth) ||
    p.markingWidth * 2 >= p.bodyLength - p.taperInset * 2
  )
    throw new Error(
      "Diode dimensions leave disconnected terminals or an invalid mold",
    )
  const slice = Math.min(p.bodyHeight - p.standoff, p.bodyWidth) / 100
  const body = (
    <Hull>
      <Cuboid
        size={[p.bodyLength, p.bodyWidth, slice]}
        center={[0, 0, p.standoff + slice / 2]}
      />
      <Cuboid
        size={[
          p.bodyLength - p.taperInset * 2,
          p.bodyWidth - p.taperInset * 2,
          slice,
        ]}
        center={[0, 0, p.bodyHeight - slice / 2]}
      />
    </Hull>
  )
  const stripe = (
    <Cuboid
      size={[p.markingWidth, (p.bodyWidth - p.taperInset * 2) * 0.9, slice]}
      center={[
        -p.bodyLength / 2 + p.taperInset + p.markingWidth,
        0,
        p.bodyHeight - slice / 2,
      ]}
    />
  )
  return (
    <>
      <Colorize color="#25272a">
        {p.markingWidth > 0 ? (
          <Subtract>
            {body}
            {stripe}
          </Subtract>
        ) : (
          body
        )}
      </Colorize>
      <Colorize color="#c7c9cd">
        <Cuboid
          size={[p.cathodeLength, p.cathodeWidth, p.terminalThickness]}
          center={[
            -p.leadSpan / 2 + p.cathodeLength / 2,
            0,
            p.terminalThickness / 2,
          ]}
        />
        <Cuboid
          size={[p.anodeLength, p.anodeWidth, p.terminalThickness]}
          center={[
            p.leadSpan / 2 - p.anodeLength / 2,
            0,
            p.terminalThickness / 2,
          ]}
        />
      </Colorize>
      {p.markingWidth > 0 && <Colorize color="#aaaaa8">{stripe}</Colorize>}
    </>
  )
}
