import { Colorize, Cuboid, Hull, Translate, Union } from "jscad-fiber"

export const SOD123W = () => {
  const fullWidth = 2.6
  const bodyLength = 1.7

  const bodyHeight = 1

  const padWidth = 0.9
  const padLength = 0.9
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
