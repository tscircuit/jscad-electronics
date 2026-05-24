import { Colorize, Cuboid, Hull, Subtract } from "jscad-fiber"

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
  const effectiveInnerDiameter = innerDiameter || 0.945
  const pinThickness = effectiveInnerDiameter / 1.5
  const socketWidth = effectiveInnerDiameter
  const socketEntryWidth = socketWidth * 1.8
  const socketEntryHeight = Math.min(bodyHeight * 0.18, pitch * 0.24)
  const socketDepth = bodyHeight + 0.1
  const socketCenterZ = flipZ(z + socketDepth / 2)
  const socketEntryBaseZ = z + bodyHeight - socketEntryHeight
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
          <Cuboid
            size={[socketWidth, socketWidth, socketDepth]}
            center={[x, y, socketCenterZ]}
          />
          <Hull>
            <Cuboid
              size={[socketWidth, socketWidth, 0.01]}
              center={[x, y, flipZ(socketEntryBaseZ)]}
            />
            <Cuboid
              size={[socketEntryWidth, socketEntryWidth, 0.01]}
              center={[x, y, flipZ(z + bodyHeight)]}
            />
          </Hull>
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
