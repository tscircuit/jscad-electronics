import { Cuboid, Colorize, Hull, Subtract, Cylinder } from "jscad-fiber"

export const FemaleHeader = ({
  numberOfPins,
  pitch = 2.54,
  legsLength = 3,
  outerDiameter = 0.945,
  innerDiameter = 0.945,
}: {
  numberOfPins: number
  pitch?: number
  legsLength?: number
  outerDiameter?: number
  innerDiameter?: number
}) => {
  const pinThickness = innerDiameter / 1.5
  const bodyDepth = pinThickness * 2 + outerDiameter
  const bodyHeight = 5
  const bodyWidth = (numberOfPins - 1) * pitch + outerDiameter + pitch / 2
  const gapWidth = pinThickness * 1.6
  const xoff = -((numberOfPins - 1) / 2) * pitch
  const Body = (
    <Colorize color="#1a1a1a">
      <Subtract>
        <Cuboid
          color="#000"
          size={[bodyWidth, bodyDepth, bodyHeight]}
          center={[0, 0, bodyHeight / 2]}
        />
        {Array.from({ length: numberOfPins }, (_, i) =>
          innerDiameter ? (
            <Cylinder
              key={i}
              height={bodyHeight + 0.1}
              radius={innerDiameter / 2}
              center={[xoff + i * pitch, 0, bodyHeight / 2]}
              color="#222"
            />
          ) : (
            <Cuboid
              key={i}
              size={[gapWidth, gapWidth, bodyHeight]}
              center={[xoff + i * pitch, 0, bodyHeight / 2]}
            />
          ),
        )}
      </Subtract>
    </Colorize>
  )
  return (
    <>
      {Body}
      {Array.from({ length: numberOfPins }, (_, i) => (
        <Colorize color="silver" key={i}>
          <Hull>
            <Cuboid
              color="silver"
              size={[pinThickness, pinThickness, legsLength * 0.9]}
              center={[xoff + i * pitch, 0, (-legsLength / 2) * 0.9]}
            />
            <Cuboid
              color="silver"
              size={[pinThickness / 1.8, pinThickness / 1.8, legsLength]}
              center={[xoff + i * pitch, 0, -legsLength / 2]}
            />
          </Hull>
          <Cuboid
            color="silver"
            size={[gapWidth, gapWidth, gapWidth * 0.5]}
            center={[xoff + i * pitch, 0, (gapWidth / 2) * 0.5]}
          />
        </Colorize>
      ))}
    </>
  )
}
