import { Colorize, Cuboid, RoundedCuboid } from "jscad-fiber"

export interface PowerRelayPin {
  /** Pin center along the relay body's length, in millimeters. */
  x: number
  /** Pin center along the relay body's width, in millimeters. */
  y: number
  /** Pin size along X. */
  width: number
  /** Pin size along Y. */
  depth: number
}

export interface PowerRelayProps {
  bodyLength?: number
  bodyWidth?: number
  bodyHeight?: number
  /** Clearance between the PCB surface and the bottom of the enclosure. */
  bodyBottom?: number
  cornerRadius?: number
  /** How far each terminal extends below the PCB surface. */
  pinLengthBelowBoard?: number
  /** How far each terminal extends into the enclosure. */
  pinInsertionDepth?: number
  pins?: readonly PowerRelayPin[]
  bodyColor?: string
  pinColor?: string
}

/**
 * Parametric through-hole power relay.
 *
 * Defaults reproduce the Hongfa HF32FV-G enclosure and C150096 terminal
 * layout. The two coil terminals are 0.45 mm square; the two contact
 * terminals are wider blades. Dimensions come from Hongfa's HF32FV drawing,
 * while the terminal centers and insertion depth are verified against the
 * modelcdn C150096 reference model.
 */
export const PowerRelay = ({
  bodyLength = 18.4,
  bodyWidth = 10.2,
  bodyHeight = 15.6,
  bodyBottom = 0.1,
  cornerRadius = 0.3,
  pinLengthBelowBoard = 3.5,
  pinInsertionDepth = 0.8,
  pins = HF32FV_PINS,
  bodyColor = "#404040",
  pinColor = "#d9d9d9",
}: PowerRelayProps) => {
  const dimensions = [
    bodyLength,
    bodyWidth,
    bodyHeight,
    pinLengthBelowBoard,
    pinInsertionDepth,
  ]
  if (
    dimensions.some(
      (dimension) => !Number.isFinite(dimension) || dimension <= 0,
    )
  )
    throw new Error("PowerRelay dimensions must be finite and positive")
  if (
    !Number.isFinite(bodyBottom) ||
    bodyBottom < 0 ||
    !Number.isFinite(cornerRadius) ||
    cornerRadius < 0 ||
    cornerRadius >= Math.min(bodyLength, bodyWidth, bodyHeight) / 2
  )
    throw new Error("PowerRelay body placement or corner radius is invalid")
  if (pins.length === 0)
    throw new Error("PowerRelay requires at least one terminal")
  for (const pin of pins) {
    if (
      ![pin.x, pin.y, pin.width, pin.depth].every(Number.isFinite) ||
      pin.width <= 0 ||
      pin.depth <= 0
    )
      throw new Error(
        "PowerRelay terminal dimensions must be finite and positive",
      )
  }

  const pinTop = bodyBottom + pinInsertionDepth
  const pinHeight = pinLengthBelowBoard + pinTop
  const pinCenterZ = (pinTop - pinLengthBelowBoard) / 2

  return (
    <>
      <Colorize color={bodyColor}>
        <RoundedCuboid
          size={[bodyLength, bodyWidth, bodyHeight]}
          center={[0, 0, bodyBottom + bodyHeight / 2]}
          roundRadius={cornerRadius}
        />
      </Colorize>
      <Colorize color={pinColor}>
        {pins.map((pin, index) => (
          <Cuboid
            key={index}
            size={[pin.width, pin.depth, pinHeight]}
            center={[pin.x, pin.y, pinCenterZ]}
          />
        ))}
      </Colorize>
    </>
  )
}

export const HF32FV_PINS = [
  { x: -7.62, y: 3.8, width: 0.45, depth: 0.45 },
  { x: -7.62, y: -3.8, width: 0.45, depth: 0.45 },
  { x: 7.62, y: 3.8, width: 0.3, depth: 0.8 },
  { x: 5.08, y: -3.8, width: 0.3, depth: 0.8 },
] as const satisfies readonly PowerRelayPin[]

/** Exact, discoverable HF32FV preset; accepts all PowerRelay overrides. */
export const HF32FVPowerRelay = (props: PowerRelayProps) => (
  <PowerRelay {...props} />
)
