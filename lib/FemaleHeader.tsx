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
  const bodyDepth = pinThickness * 2 + outerDiameter
  const bodyHeight = 5
  const pinsPerRow = Math.ceil(numberOfPins / rows)
  const rowSpacing = 2.54 // Standard spacing between rows
  const bodyWidth = (pinsPerRow - 1) * pitch + outerDiameter + pitch / 2
  const bodyDepthTotal =
    rows > 1 ? (rows - 1) * rowSpacing + bodyDepth : bodyDepth
  const gapWidth = pinThickness * 1.6
  const xoff = -((pinsPerRow - 1) / 2) * pitch
  // Row 1 starts at y=0, subsequent rows are positioned below (negative y)
  const bodyCenterY = rows > 1 ? -((rows - 1) * rowSpacing) / 2 : 0
  const Body = (
    <Colorize color="#1a1a1a">
      <Subtract>
        <Cuboid
          color="#000"
          size={[bodyWidth, bodyDepthTotal, bodyHeight]}
          center={[0, bodyCenterY, bodyHeight / 2]}
        />
        {Array.from({ length: numberOfPins }, (_, i) => {
          const row = Math.floor(i / pinsPerRow)
          const col = i % pinsPerRow
          const x = xoff + col * pitch
          // Row 1 (row 0) starts at y=0, subsequent rows go downward (negative y)
          const y = -row * rowSpacing

          return innerDiameter ? (
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
          )
        })}
      </Subtract>
    </Colorize>
  )
  return (
    <>
      {Body}
      {Array.from({ length: numberOfPins }, (_, i) => {
        const row = Math.floor(i / pinsPerRow)
        const col = i % pinsPerRow
        const x = xoff + col * pitch
        // Row 1 (row 0) starts at y=0, subsequent rows go downward (negative y)
        const y = -row * rowSpacing

        return (
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
        )
      })}
    </>
  )
}
