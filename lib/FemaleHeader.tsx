import { Colorize, Cuboid, Cylinder, Hull, Subtract } from "jscad-fiber"

export const FemaleHeader = ({
  x,
  y,
  z = 0,
  pitch = 2.54,
  legsLength = 3,
  innerDiameter = 0.945,
  bodyHeight = 5,
  bodyLength = pitch,
  bodyWidth = pitch,
  flipZ,
}: {
  x: number
  y: number
  z?: number
  pitch?: number
  legsLength?: number
  innerDiameter?: number
  bodyHeight?: number
  bodyLength?: number
  bodyWidth?: number
  flipZ: (z: number) => number
}) => {
  const pinThickness = innerDiameter / 1.5
  const gapWidth = pinThickness * 1.6

  return (
    <>
      <Colorize color="#1a1a1a">
        <Subtract>
          <Cuboid
            color="#000"
            size={[bodyLength, bodyWidth, bodyHeight]}
            center={[x, y, flipZ(z + bodyHeight / 2)]}
          />
          {innerDiameter ? (
            <Cylinder
              height={bodyHeight + 0.1}
              radius={innerDiameter / 2}
              center={[x, y, flipZ(z + bodyHeight / 2)]}
              color="#222"
            />
          ) : (
            <Cuboid
              size={[gapWidth, gapWidth, bodyHeight]}
              center={[x, y, flipZ(z + bodyHeight / 2)]}
            />
          )}
        </Subtract>
      </Colorize>
      <Colorize color="silver">
        <Hull>
          <Cuboid
            color="silver"
            size={[pinThickness, pinThickness, legsLength * 0.9]}
            center={[x, y, flipZ(z + (-legsLength / 2) * 0.9)]}
          />
          <Cuboid
            color="silver"
            size={[pinThickness / 1.8, pinThickness / 1.8, legsLength]}
            center={[x, y, flipZ(z + -legsLength / 2)]}
          />
        </Hull>
        <Cuboid
          color="silver"
          size={[gapWidth, gapWidth, gapWidth * 0.5]}
          center={[x, y, flipZ(z + (gapWidth / 2) * 0.5)]}
        />
      </Colorize>
    </>
  )
}
