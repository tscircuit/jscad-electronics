import { Colorize, Cuboid, Cylinder } from "jscad-fiber"

export interface SmdPushButtonProps {
  /** X extent of the moulded body. */
  bodyWidth?: number
  /** Y extent of the moulded body. */
  bodyLength?: number
  /** Height of the body above the board. */
  bodyHeight?: number
  /** Diameter of the actuator on the top face. */
  actuatorDiameter?: number
  /** How far the actuator stands proud of the body — the real part height. */
  actuatorHeight?: number
  /** X distance between the pad centres on opposite sides. */
  padSpanX?: number
  /** Y distance between the two pad rows. */
  padSpanY?: number
  padWidth?: number
  padLength?: number
  bodyColor?: string
  actuatorColor?: string
  leadColor?: string
}

/**
 * SMD tactile push button.
 *
 * The body outline is the footprint's silkscreen (2.86 x 3.04 for footprinter's
 * `smdpushbutton`); the height is the switch's, not the footprint's — a
 * footprint cannot describe an actuator. `actuatorHeight` is the part of that
 * height an enclosure lid has to clear or press on, so it is separate from
 * `bodyHeight` rather than folded into it.
 */
export const SmdPushButton = ({
  bodyWidth = 2.9,
  bodyLength = 3.0,
  bodyHeight = 1.4,
  actuatorDiameter = 1.5,
  actuatorHeight = 0.5,
  padSpanX = 4.2,
  padSpanY = 2.15,
  padWidth = 1.05,
  padLength = 0.7,
  bodyColor = "#2b2b2b",
  actuatorColor = "#d9d9d9",
  leadColor = "#cccccc",
}: SmdPushButtonProps) => {
  const leadThickness = 0.15

  return (
    <>
      <Colorize color={bodyColor}>
        <Cuboid
          size={[bodyWidth, bodyLength, bodyHeight]}
          center={[0, 0, bodyHeight / 2]}
        />
      </Colorize>

      <Colorize color={actuatorColor}>
        <Cylinder
          radius={actuatorDiameter / 2}
          height={actuatorHeight}
          center={[0, 0, bodyHeight + actuatorHeight / 2]}
        />
      </Colorize>

      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sy) => (
          <Colorize color={leadColor} key={`lead-${sx}-${sy}`}>
            <Cuboid
              size={[padWidth, padLength, leadThickness]}
              center={[
                (sx * padSpanX) / 2,
                (sy * padSpanY) / 2,
                leadThickness / 2,
              ]}
            />
          </Colorize>
        )),
      )}
    </>
  )
}

export default SmdPushButton
