import { Cuboid, Colorize, Translate } from "jscad-fiber"
import { range } from "./utils/range"

export const JST = ({
  numPins = 2,
  pitch = 2.0,
  bodyWidth,
  bodyDepth = 4.5,
  bodyHeight = 6.0,
}: {
  numPins?: number
  pitch?: number
  bodyWidth?: number
  bodyDepth?: number
  bodyHeight?: number
}) => {
  const calculatedWidth = bodyWidth ?? (numPins - 1) * pitch + 4.0
  const zOffset = bodyHeight / 2

  return (
    <>
      {/* Connector Body */}
      <Colorize color="#f0f0f0">
        <Cuboid
          size={[calculatedWidth, bodyDepth, bodyHeight]}
          center={[0, 0, zOffset]}
        />
      </Colorize>

      {/* Pins */}
      <Colorize color="gold">
        {range(numPins).map((i) => {
          const xPos = i * pitch - ((numPins - 1) * pitch) / 2
          return (
            <Translate key={i} offset={[xPos, 0, 0]}>
              <Cuboid
                size={[0.5, 0.5, bodyHeight + 3]} // 3mm pin sticking out
                center={[0, 0, (bodyHeight + 3) / 2 - 3]}
              />
            </Translate>
          )
        })}
      </Colorize>

      {/* Small Notch for orientation (simple representation) */}
      <Colorize color="#e0e0e0">
        <Translate offset={[0, bodyDepth / 2 - 0.5, zOffset]}>
          <Cuboid size={[calculatedWidth - 1, 1, bodyHeight - 1]} />
        </Translate>
      </Colorize>
    </>
  )
}

export default JST
