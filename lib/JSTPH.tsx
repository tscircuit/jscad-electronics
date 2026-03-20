import { Colorize, Cuboid, Cylinder, Subtract, Translate } from "jscad-fiber"

interface JSTPHProps {
  numPins?: number
  bodyColor?: string
  pinColor?: string
}

/**
 * JST PH connector 3D model (2.0mm pitch, through-hole)
 * Based on JST PH-series datasheet dimensions
 */
export const JSTPH = ({
  numPins = 4,
  bodyColor = "#f5f5f5",
  pinColor = "#b5a642",
}: JSTPHProps) => {
  const pitch = 2.2 // matches footprinter default
  const bodyHeight = 6.0
  const bodyDepth = 4.5
  const wallThickness = 0.6
  const hollowDepth = bodyHeight * 0.55
  const pinLength = 5.5
  const pinRadius = 0.32
  const bodyWidth = (numPins - 1) * pitch + 4.0
  const startX = -((numPins - 1) * pitch) / 2

  // Footprinter places PH pads at y=2
  const padY = 2

  return (
    <>
      {/* Housing body - positioned to align with footprint */}
      <Translate offset={[0, padY, bodyHeight / 2]}>
        <Colorize color={bodyColor}>
          <Subtract>
            {/* Outer shell */}
            <Cuboid size={[bodyWidth, bodyDepth, bodyHeight]} />
            {/* Hollow interior (open top) */}
            <Translate offset={[0, 0, wallThickness]}>
              <Cuboid
                size={[
                  bodyWidth - wallThickness * 2,
                  bodyDepth - wallThickness * 2,
                  hollowDepth,
                ]}
              />
            </Translate>
            {/* Front slot for wire entry */}
            <Translate offset={[0, -bodyDepth / 2, wallThickness / 2]}>
              <Cuboid
                size={[
                  bodyWidth - wallThickness * 4,
                  wallThickness * 1.5,
                  hollowDepth * 0.7,
                ]}
              />
            </Translate>
          </Subtract>
        </Colorize>
      </Translate>

      {/* Locking tab on top */}
      <Translate offset={[0, padY + bodyDepth / 2 - 0.5, bodyHeight - 0.3]}>
        <Colorize color={bodyColor}>
          <Cuboid size={[bodyWidth * 0.4, 1.2, 0.8]} />
        </Colorize>
      </Translate>

      {/* Pins - through-hole, extending below the board */}
      {Array.from({ length: numPins }).map((_, i) => (
        <Colorize key={`pin-${i}`} color={pinColor}>
          <Translate offset={[startX + i * pitch, padY, -pinLength / 2 + 1]}>
            <Cylinder height={pinLength} radius={pinRadius} />
          </Translate>
        </Colorize>
      ))}
    </>
  )
}

export default JSTPH
