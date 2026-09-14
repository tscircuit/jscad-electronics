import { Colorize, Cuboid, Cylinder, Subtract, Translate } from "jscad-fiber"

/** Physical QFN outline, in mm. Unlike the legacy land-derived API, bodyWidth
 * and bodyLength measure the mold itself. Terminal spans measure outer edges,
 * allowing both sawn and punched standard outlines. Pin 1 is at -X,+Y.
 * This variant has equally many terminals on all four sides.
 */
export interface PhysicalQfnDimensions {
  num_pins: number
  bodyWidth: number
  bodyLength: number
  /** Overall height A from the seating plane. */
  bodyHeight: number
  standoff: number
  terminalSpanX: number
  terminalSpanY: number
  terminalThickness: number
  padWidth: number
  padLength: number
  pitch: number
  exposedPadWidth: number
  exposedPadLength: number
}

export function createPhysicalQfn(p: PhysicalQfnDimensions) {
  const {
    num_pins,
    bodyWidth,
    bodyLength,
    bodyHeight,
    standoff,
    terminalSpanX,
    terminalSpanY,
    terminalThickness,
    padWidth,
    padLength,
    pitch,
    exposedPadWidth,
    exposedPadLength,
  } = p
  for (const key of [
    "bodyWidth",
    "bodyLength",
    "bodyHeight",
    "terminalSpanX",
    "terminalSpanY",
    "terminalThickness",
    "padWidth",
    "padLength",
    "pitch",
    "exposedPadWidth",
    "exposedPadLength",
  ] as const)
    if (!Number.isFinite(p[key]) || p[key] <= 0)
      throw new Error(`${key} must be finite and positive`)
  if (!Number.isInteger(num_pins) || num_pins < 8 || num_pins % 4)
    throw new Error("num_pins must be divisible by four and at least eight")
  if (!Number.isFinite(standoff) || standoff < 0)
    throw new Error("standoff must be finite and nonnegative")
  const rowLength = (num_pins / 4 - 1) * pitch + padWidth
  if (
    terminalThickness <= standoff ||
    terminalThickness >= bodyHeight ||
    padWidth >= pitch ||
    rowLength >= Math.min(bodyWidth, bodyLength)
  )
    throw new Error("Invalid mold, terminal thickness or spacing")
  // Avoid disconnected roots, exposed-pad shorts, and adjacent-side overlap.
  if (
    terminalSpanX < bodyWidth ||
    terminalSpanY < bodyLength ||
    terminalSpanX / 2 - padLength >= bodyWidth / 2 ||
    terminalSpanY / 2 - padLength >= bodyLength / 2 ||
    exposedPadWidth >= Math.min(bodyWidth, terminalSpanX - 2 * padLength) ||
    exposedPadLength >= Math.min(bodyLength, terminalSpanY - 2 * padLength) ||
    rowLength >= Math.min(terminalSpanX, terminalSpanY) - 2 * padLength
  )
    throw new Error(
      "Terminals must enter the mold and clear the exposed pad and corners",
    )
  const body = (
    <Translate z={(bodyHeight + standoff) / 2}>
      <Cuboid size={[bodyWidth, bodyLength, bodyHeight - standoff]} />
    </Translate>
  )
  const radius = Math.min(bodyWidth, bodyLength) * 0.035
  return (
    <>
      <Colorize color="#353535">
        <Subtract>
          {body}
          <Translate
            offset={{
              x: -bodyWidth / 2 + radius * 2,
              y: bodyLength / 2 - radius * 2,
              z: bodyHeight,
            }}
          >
            <Cylinder
              radius={radius}
              height={Math.min(0.06, (bodyHeight - standoff) / 5)}
            />
          </Translate>
        </Subtract>
      </Colorize>
      <Colorize color="#bfc1c4">
        {Array.from({ length: num_pins }, (_, i) => {
          const side = Math.floor(i / (num_pins / 4))
          const along = ((num_pins / 4 - 1) / 2 - (i % (num_pins / 4))) * pitch
          const horizontal = side % 2 === 0
          const sign = side < 2 ? -1 : 1
          const across =
            (((horizontal ? terminalSpanX : terminalSpanY) - padLength) / 2) *
            sign
          return (
            <Translate
              key={i}
              offset={{
                x: horizontal ? across : along,
                y: horizontal ? along : across,
                z: terminalThickness / 2,
              }}
            >
              <Cuboid
                size={
                  horizontal
                    ? [padLength, padWidth, terminalThickness]
                    : [padWidth, padLength, terminalThickness]
                }
              />
            </Translate>
          )
        })}
      </Colorize>
      <Colorize color="#bfc1c4">
        <Translate z={terminalThickness / 2}>
          <Cuboid
            size={[exposedPadWidth, exposedPadLength, terminalThickness]}
          />
        </Translate>
      </Colorize>
    </>
  )
}
