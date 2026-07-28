import { Colorize, Cuboid } from "jscad-fiber"

interface CrystalProps {
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
 * 4-pad SMD quartz crystal: metal can over a dark base.
 */
export const Crystal = ({
  padPitchX = 2.2,
  padPitchY = 1.7,
  padWidth = 1.4,
  padLength = 1.2,
  bodyWidth = 3.2,
  bodyLength = 2.5,
  bodyHeight = 0.8,
}: CrystalProps) => {
  return (
    <>
      {/* Corner pads */}
      {[-1, 1].map((sx) =>
        [-1, 1].map((sy) => (
          <Colorize key={`${sx}${sy}`} color="#c0c0c0">
            <Cuboid
              size={[padWidth, padLength, 0.05]}
              center={[(sx * padPitchX) / 2, (sy * padPitchY) / 2, 0.025]}
            />
          </Colorize>
        )),
      )}

      {/* Dark base */}
      <Colorize color="#3a3a3a">
        <Cuboid
          size={[bodyWidth, bodyLength, bodyHeight * 0.4]}
          center={[0, 0, bodyHeight * 0.2 + 0.05]}
        />
      </Colorize>

      {/* Metal can */}
      <Colorize color="#d8d8d8">
        <Cuboid
          size={[bodyWidth * 0.94, bodyLength * 0.94, bodyHeight * 0.6]}
          center={[0, 0, bodyHeight * 0.4 + bodyHeight * 0.3 + 0.05]}
        />
      </Colorize>
    </>
  )
}

export default Crystal
