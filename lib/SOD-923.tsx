import { Colorize, Cuboid, Hull, Translate, Union } from "jscad-fiber"

export const SOD923 = () => {
  const fullWidth = 0.80
  const bodyLength = 0.60

  const bodyHeight = 0.37

  const padWidth = 0.20
  const padLength = 0.20
  const padThickness = 0.120

  const leftPadCenterX = -(fullWidth / 2)
  const rightPadCenterX = fullWidth / 2

  const taperOffset = 0.1
  const straightHeight = padThickness

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

export default SOD923