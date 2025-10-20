import { Cuboid, Colorize, Union, Hull, Translate } from "jscad-fiber"

export const SMB = () => {
  const bodyWidth = 4.4
  const bodyLength = 3.4
  const bodyHeight = 2.3
  const padWidth = 1.45
  const padThickness = 0.12

  const leadThickness = 0.2
  const leadHeight = 1.14

  const taperOffset = 0.4
  const straightHeight = bodyHeight * 0.5

  const Body = (
    <Colorize color="#1a1a1a">
      <Union>
        <Hull>
          <Translate z={padThickness + 0.01}>
            <Cuboid
              size={[bodyWidth - taperOffset, bodyLength - taperOffset, 0.03]}
            />
          </Translate>
          <Translate z={straightHeight}>
            <Cuboid size={[bodyWidth, bodyLength, 0.01]} />
          </Translate>
        </Hull>
        <Hull>
          <Translate z={straightHeight}>
            <Cuboid size={[bodyWidth, bodyLength, 0.01]} />
          </Translate>
          <Translate z={bodyHeight}>
            <Cuboid
              size={[bodyWidth - taperOffset, bodyLength - taperOffset, 0.01]}
            />
          </Translate>
        </Hull>
      </Union>
    </Colorize>
  )

  const Lead = ({ xDir }: { xDir: number }) => {
    const verticalGap = 1
    const lowerPadGap = 1
    const lowerPadX =
      xDir * (bodyLength / 2 - (bodyHeight * 0.8) / 2 + lowerPadGap)
    const verticalLeadX =
      xDir * (bodyLength / 2 - leadThickness / 2 + verticalGap)
    const bodyEdgeX = xDir * (bodyLength / 2 - leadThickness / 2)
    const bridgeLength = Math.abs(bodyEdgeX - verticalLeadX)
    const bridgeCenterX = (verticalLeadX + bodyEdgeX) / 2

    return (
      <Colorize color="#c0c0c0">
        <Union>
          <Cuboid
            size={[bodyHeight * 0.8, padWidth, leadThickness]}
            center={[lowerPadX, 0, leadThickness / 2]}
          />
          <Cuboid
            size={[leadThickness, padWidth, leadHeight]}
            center={[verticalLeadX, 0, leadHeight / 2 + leadThickness]}
          />
          <Cuboid
            size={[bridgeLength, padWidth, leadThickness]}
            center={[bridgeCenterX, 0, leadThickness / 2 + leadHeight]}
          />
        </Union>
      </Colorize>
    )
  }

  return (
    <>
      <Lead xDir={1} />
      <Lead xDir={-1} />
      {Body}
    </>
  )
}

export default SMB
