import { Colorize, Cuboid, Cylinder } from "jscad-fiber"

interface SmdPushButtonProps {
  /** pad pitch X (footprinter px) */
  padPitchX?: number
  /** pad pitch Y (footprinter py) */
  padPitchY?: number
  padWidth?: number
  padLength?: number
  bodyWidth?: number
  bodyLength?: number
  bodyHeight?: number
}

/**
 * SMD tactile push button: square base, round actuator, 4 corner pads.
 */
export const SmdPushButton = ({
  padPitchX = 4.2,
  padPitchY = 2.15,
  padWidth = 1.05,
  padLength = 0.7,
  bodyWidth = 6,
  bodyLength = 6,
  bodyHeight = 3.5,
}: SmdPushButtonProps) => {
  return (
    <>
      {/* 4 corner gull-wing pads */}
      {[-1, 1].map((sx) =>
        [-1, 1].map((sy) => (
          <Colorize key={`${sx}${sy}`} color="#c0c0c0">
            <Cuboid
              size={[padWidth, padLength, 0.15]}
              center={[(sx * padPitchX) / 2, (sy * padPitchY) / 2, 0.075]}
            />
          </Colorize>
        )),
      )}

      {/* Base */}
      <Colorize color="#e8e8e8">
        <Cuboid
          size={[bodyWidth, bodyLength, bodyHeight * 0.55]}
          center={[0, 0, (bodyHeight * 0.55) / 2 + 0.1]}
        />
      </Colorize>

      {/* Top cover */}
      <Colorize color="#9a9a9a">
        <Cuboid
          size={[bodyWidth * 0.96, bodyLength * 0.96, bodyHeight * 0.25]}
          center={[0, 0, bodyHeight * 0.55 + bodyHeight * 0.125 + 0.1]}
        />
      </Colorize>

      {/* Actuator */}
      <Colorize color="#222">
        <Cylinder
          radius={bodyWidth * 0.28}
          height={bodyHeight * 0.35}
          center={[0, 0, bodyHeight * 0.8 + bodyHeight * 0.175 + 0.1]}
        />
      </Colorize>
    </>
  )
}

export default SmdPushButton
