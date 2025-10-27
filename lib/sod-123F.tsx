import { Colorize, Cuboid, Hull, Translate, Union } from "jscad-fiber"

export const SOD123F = () => {
  const fullWidth = 2.7
  const bodyLength = 1.6
  const bodyHeight = 1.1

  const padWidth = 0.6
  const padLength = 1
  const padThickness = 0.12

  const leftPadCenterX = -1.3
  const rightPadCenterX = 1.3

  const taperOffset = 0.2
  const straightHeight = bodyHeight * 0.5

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
    </>
  )
}

export default SOD123F
