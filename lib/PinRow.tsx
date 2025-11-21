import { Cuboid, Cylinder, Union, HullChain, Colorize, Hull } from "jscad-fiber"

export const PinRow = ({
  numberOfPins,
  pitch = 2.54,
  longSidePinLength = 6,
}: {
  numberOfPins: number
  pitch?: number
  longSidePinLength?: number
}) => {
  const pinThickness = 0.63
  const bodyHeight = 2
  const bodyWidth = numberOfPins * pitch
  const shortSidePinLength = 3
  const xoff = -((numberOfPins - 1) / 2) * pitch
  return (
    <>
      <Cuboid
        color="#222"
        size={[bodyWidth, pinThickness * 3, bodyHeight]}
        center={[0, 0, bodyHeight / 2 + 0.012]}
      />
      {Array.from({ length: numberOfPins }, (_, i) => (
        <>
          {/*Short pins (top) */}
          <Colorize color="gold">
            <Hull>
              <Cuboid
                color="gold"
                size={[pinThickness, pinThickness, shortSidePinLength * 0.9]}
                center={[
                  xoff + i * pitch,
                  0,
                  bodyHeight * 0.9 + bodyHeight / 2,
                ]}
              />
              <Cuboid
                color="gold"
                size={[
                  pinThickness / 1.8,
                  pinThickness / 1.8,
                  shortSidePinLength,
                ]}
                center={[xoff + i * pitch, 0, bodyHeight + bodyHeight / 2]}
              />
            </Hull>
          </Colorize>
          {/*Long pins (bottom) */}
          <Colorize color="gold">
            <Hull>
              <Cuboid
                color="gold"
                size={[pinThickness, pinThickness, longSidePinLength * 0.9]}
                center={[xoff + i * pitch, 0, (-longSidePinLength / 2) * 0.9]}
              />
              <Cuboid
                color="gold"
                size={[
                  pinThickness / 1.8,
                  pinThickness / 1.8,
                  longSidePinLength,
                ]}
                center={[xoff + i * pitch, 0, -longSidePinLength / 2]}
              />
            </Hull>
          </Colorize>
        </>
      ))}
    </>
  )
}
