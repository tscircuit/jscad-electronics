import { Colorize, Cuboid, Hull, Translate, Union } from "jscad-fiber"

export const SOD123FL = () => {
  const fullWidth = 2.75
  const bodyLength = 1.8

  const bodyHeight = 1

  const padWidth = 0.9
  const padLength = 1
  const padThickness = 0.2

  const leftPadCenterX = -(fullWidth / 2 - 0.075)
  const rightPadCenterX = fullWidth / 2 - 0.075

  const taperOffset = 0.4
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
          <Translate z={straightHeight / 2}>
            <Cuboid size={[fullWidth, bodyLength, straightHeight]} />
          </Translate>

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
        size={[padThickness, bodyLength - taperOffset, 0.01]}
        center={[leftPadCenterX + taperOffset, 0, bodyHeight]}
      />
    </>
  )
}

export default SOD123FL
