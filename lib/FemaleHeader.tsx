import { Cuboid, Colorize, Hull, Subtract, Cylinder } from "jscad-fiber"

export const FemaleHeader = ({
  numberOfPins,
  pitch = 2.54,
  legsLength = 3,
  outerDiameter = 0.945,
  innerDiameter = 0.945,
  rows = 1,
}: {
  numberOfPins: number
  pitch?: number
  legsLength?: number
  outerDiameter?: number
  innerDiameter?: number
  rows?: number
}) => {
  const pinThickness = innerDiameter / 1.5
  const numPinsPerRow = Math.ceil(numberOfPins / rows)
  const bodyDepth = (rows - 1) * pitch + pinThickness * 2 + outerDiameter
  const bodyHeight = 5
  const bodyWidth = (numPinsPerRow - 1) * pitch + outerDiameter + pitch / 2
  const gapWidth = pinThickness * 1.6
  const xStart = -((numPinsPerRow - 1) / 2) * pitch
  const ySpacing = -pitch

  const positions: [number, number][] = []

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

  const Body = (
    <Colorize color="#1a1a1a">
      <Subtract>
        <Cuboid
          color="#000"
          size={[bodyWidth, bodyDepth, bodyHeight]}
          center={[0, (-(rows - 1) * pitch) / 2, bodyHeight / 2]}
        />
        {positions.map(([x, y], i) =>
          innerDiameter ? (
            <Cylinder
              key={i}
              height={bodyHeight + 0.1}
              radius={innerDiameter / 2}
              center={[x, y, bodyHeight / 2]}
              color="#222"
            />
          ) : (
            <Cuboid
              key={i}
              size={[gapWidth, gapWidth, bodyHeight]}
              center={[x, y, bodyHeight / 2]}
            />
          ),
        )}
      </Subtract>
    </Colorize>
  )
  return (
    <>
      {Body}
      {positions.map(([x, y], i) => (
        <Colorize color="silver" key={i}>
          <Hull>
            <Cuboid
              color="silver"
              size={[pinThickness, pinThickness, legsLength * 0.9]}
              center={[x, y, (-legsLength / 2) * 0.9]}
            />
            <Cuboid
              color="silver"
              size={[pinThickness / 1.8, pinThickness / 1.8, legsLength]}
              center={[x, y, -legsLength / 2]}
            />
          </Hull>
          <Cuboid
            color="silver"
            size={[gapWidth, gapWidth, gapWidth * 0.5]}
            center={[x, y, (gapWidth / 2) * 0.5]}
          />
        </Colorize>
      ))}
    </>
  )
}
