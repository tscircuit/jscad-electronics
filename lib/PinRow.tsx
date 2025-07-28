import { Cuboid, Colorize, Hull } from "jscad-fiber"

export const PinRow = ({
  numberOfPins,
  pitch = 2.54,
  longSidePinLength = 6,
  rows = 1,
}: {
  numberOfPins: number
  pitch?: number
  longSidePinLength?: number
  rows?: number
}) => {
  const pinThickness = 0.63
  const bodyHeight = 2
  const numPinsPerRow = Math.ceil(numberOfPins / rows)
  const bodyWidth = numPinsPerRow * pitch
  const bodyDepth = (rows - 1) * pitch + pinThickness * 3
  const shortSidePinLength = 3

  const positions: [number, number][] = []
  const ySpacing = -pitch
  const xStart = -((numPinsPerRow - 1) / 2) * pitch

  if (rows === 1) {
    for (let i = 0; i < numberOfPins; i++) {
      positions.push([xStart + i * pitch, 0])
    }
  } else if (rows > 2 && numPinsPerRow > 2) {
    let current = 0
    for (let r = 0; r < rows && current < numberOfPins; r++) {
      for (let c = 0; c < numPinsPerRow && current < numberOfPins; c++) {
        positions.push([xStart + c * pitch, r * ySpacing])
        current++
      }
    }
  } else {
    let current = 0
    let top = 0
    let bottom = rows - 1
    let left = 0
    let right = numPinsPerRow - 1
    while (current < numberOfPins && top <= bottom && left <= right) {
      for (let row = top; row <= bottom && current < numberOfPins; row++) {
        positions.push([xStart + left * pitch, row * ySpacing])
        current++
      }
      left++
      for (let col = left; col <= right && current < numberOfPins; col++) {
        positions.push([xStart + col * pitch, bottom * ySpacing])
        current++
      }
      bottom--
      if (left <= right) {
        for (let row = bottom; row >= top && current < numberOfPins; row--) {
          positions.push([xStart + right * pitch, row * ySpacing])
          current++
        }
        right--
      }
      if (top <= bottom) {
        for (let col = right; col >= left && current < numberOfPins; col--) {
          positions.push([xStart + col * pitch, top * ySpacing])
          current++
        }
        top++
      }
    }
  }

  return (
    <>
      <Cuboid
        color="#222"
        size={[bodyWidth, bodyDepth, bodyHeight]}
        center={[0, (-(rows - 1) * pitch) / 2, bodyHeight / 2]}
      />
      {positions.map(([x, y], i) => (
        <>
          {/*Short pins (top) */}
          <Colorize color="gold" key={`s${i}`}>
            <Hull>
              <Cuboid
                color="gold"
                size={[pinThickness, pinThickness, shortSidePinLength * 0.9]}
                center={[x, y, bodyHeight * 0.9 + bodyHeight / 2]}
              />
              <Cuboid
                color="gold"
                size={[
                  pinThickness / 1.8,
                  pinThickness / 1.8,
                  shortSidePinLength,
                ]}
                center={[x, y, bodyHeight + bodyHeight / 2]}
              />
            </Hull>
          </Colorize>
          {/*Long pins (bottom) */}
          <Colorize color="gold" key={`l${i}`}>
            <Hull>
              <Cuboid
                color="gold"
                size={[pinThickness, pinThickness, longSidePinLength * 0.9]}
                center={[x, y, (-longSidePinLength / 2) * 0.9]}
              />
              <Cuboid
                color="gold"
                size={[
                  pinThickness / 1.8,
                  pinThickness / 1.8,
                  longSidePinLength,
                ]}
                center={[x, y, -longSidePinLength / 2]}
              />
            </Hull>
          </Colorize>
        </>
      ))}
    </>
  )
}
