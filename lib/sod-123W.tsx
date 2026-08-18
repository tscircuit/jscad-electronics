import { Colorize, Cuboid, Hull, Translate, Union } from "jscad-fiber"

export interface SOD123WProps {
  /** Body extent along the leads (X). */
  bodyWidth?: number
  /** Body extent across the leads (Y). */
  bodyLength?: number
  bodyHeight?: number
}

/**
 * SOD-123W.
 *
 * Defaults are the package outline for that designation — 2.60 x 1.70, per
 * KiCad's `Nexperia_CFP3_SOD-123W` F.Fab layer, which is the same reference
 * footprinter's own kicad-parity tests compare against.
 *
 * The dimensions are props because the shape (a moulded body with a metal cap
 * at each end) serves several designations at different sizes; the SIZE is
 * what makes it one package or another, so it must never be assumed. `sod110`
 * used these defaults for a while and rendered a body 24% too long.
 */
export const SOD123W = ({
  bodyWidth = 2.6,
  bodyLength = 1.7,
  bodyHeight = 1,
}: SOD123WProps = {}) => {
  const fullWidth = bodyWidth

  const padWidth = bodyLength * 0.53
  const padLength = bodyWidth * 0.35
  const padThickness = 0.2

  const leftPadCenterX = -(fullWidth / 2 - 0.075)
  const rightPadCenterX = fullWidth / 2 - 0.075

  const taperOffset = 0.4
  const lowerTaperOffset = 0.1
  const straightHeight = bodyHeight * 0.2

  return (
    <>
      {/* Left pad */}
      <Cuboid
        color="#ccc"
        size={[padLength, padWidth, padThickness]}
        center={[leftPadCenterX, 0, padThickness / 2]}
      />

      {/* Right pad */}
      <Cuboid
        color="#ccc"
        size={[padLength, padWidth, padThickness]}
        center={[rightPadCenterX, 0, padThickness / 2]}
      />

      {/* Body */}
      <Colorize color="#222">
        <Union>
          {/* Middle straight section */}
          <Hull>
            <Translate z={straightHeight}>
              <Cuboid
                size={[
                  fullWidth - lowerTaperOffset / 2,
                  bodyLength - lowerTaperOffset / 2,
                  0.01,
                ]}
              />
            </Translate>
            <Translate z={0.01}>
              <Cuboid
                size={[
                  fullWidth - lowerTaperOffset,
                  bodyLength - lowerTaperOffset,
                  0.01,
                ]}
              />
            </Translate>
          </Hull>

          {/* Top taper section */}
          <Hull>
            <Translate z={straightHeight}>
              <Cuboid size={[fullWidth, bodyLength, 0.01]} />
            </Translate>
            <Translate z={bodyHeight}>
              <Cuboid
                size={[fullWidth - taperOffset, bodyLength - taperOffset, 0.01]}
              />
            </Translate>
          </Hull>
        </Union>
      </Colorize>

      {/* Grey polarity/top strip */}
      <Cuboid
        color="#777"
        size={[padThickness * 2.7, bodyLength - taperOffset, 0.02]}
        center={[leftPadCenterX + taperOffset, 0, bodyHeight]}
      />
    </>
  )
}

export default SOD123W
