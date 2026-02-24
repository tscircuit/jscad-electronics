import { Colorize, Cuboid, Cylinder, Subtract, Union } from "jscad-fiber"

export const StampBoard = ({
  bodyWidth = 21,
  boardThickness = 0.5,
  leadWidth = 1.6,
  leadLength = 2.4,
  leadsPitch = 2.54,
  leadsLeft,
  leadsRight,
  leadsTop,
  leadsBottom,
  innerHoles = true,
  innerHoleEdgeDistance = 1.61,
  innerHoleDiameter = 1,
}: {
  bodyWidth?: number
  boardThickness?: number
  leadWidth?: number
  leadLength?: number
  leadsPitch?: number
  leadsLeft?: number
  leadsRight?: number
  leadsTop?: number
  leadsBottom?: number
  innerHoles?: boolean
  innerHoleEdgeDistance?: number
  innerHoleDiameter?: number
}) => {
  const halfBoardWidth = bodyWidth / 2
  const boardCenterZ = boardThickness / 2
  const boardHeight = boardThickness * 1.05
  const holeRadius = innerHoleDiameter / 2
  const bodyLength =
    Math.max(leadsLeft || 0, leadsRight || 0, leadsTop || 0, leadsBottom || 0) *
      leadsPitch || 51

  const pads: { x: number; y: number; pl: number; pw: number }[] = []
  const holes: { x: number; y: number }[] = []

  if (leadsRight) {
    const yOffset = -((leadsRight - 1) / 2) * leadsPitch
    for (let i = 0; i < leadsRight; i++) {
      const y = yOffset + i * leadsPitch
      pads.push({
        x: halfBoardWidth - leadLength / 2,
        y: -y, // Flip y
        pl: leadLength,
        pw: leadWidth,
      })
      if (innerHoles) {
        holes.push(
          { x: halfBoardWidth, y: -y },
          { x: halfBoardWidth - innerHoleEdgeDistance, y: -y },
        )
      }
    }
  }

  if (leadsLeft) {
    const yOffset = -((leadsLeft - 1) / 2) * leadsPitch
    for (let i = 0; i < leadsLeft; i++) {
      const y = yOffset + i * leadsPitch
      pads.push({
        x: -halfBoardWidth + leadLength / 2,
        y: -y, // Flip y
        pl: leadLength,
        pw: leadWidth,
      })
      if (innerHoles) {
        holes.push(
          { x: -halfBoardWidth, y: -y },
          { x: -halfBoardWidth + innerHoleEdgeDistance, y: -y },
        )
      }
    }
  }

  if (leadsTop) {
    const xOffset = -((leadsTop - 1) / 2) * leadsPitch
    for (let i = 0; i < leadsTop; i++) {
      const x = xOffset + i * leadsPitch
      pads.push({
        x: -x, // Flip x
        y: bodyLength / 2 - leadLength / 2,
        pl: leadWidth,
        pw: leadLength,
      })
      if (innerHoles) {
        holes.push(
          { x: -x, y: bodyLength / 2 },
          { x: -x, y: bodyLength / 2 - innerHoleEdgeDistance },
        )
      }
    }
  }

  if (leadsBottom) {
    const xOffset = -((leadsBottom - 1) / 2) * leadsPitch
    for (let i = 0; i < leadsBottom; i++) {
      const x = xOffset + i * leadsPitch
      pads.push({
        x: -x, // Flip x
        y: -bodyLength / 2 + leadLength / 2,
        pl: leadWidth,
        pw: leadLength,
      })
      if (innerHoles) {
        holes.push(
          { x: -x, y: -bodyLength / 2 },
          { x: -x, y: -bodyLength / 2 + innerHoleEdgeDistance },
        )
      }
    }
  }

  const boardBody = (
    <Colorize color="#051a0a">
      <Subtract>
        <Cuboid
          center={[0, 0, boardCenterZ]}
          size={[bodyWidth, bodyLength, boardThickness]}
        />
        {pads.map((pad, index) => (
          <Cuboid
            key={index}
            center={[pad.x, pad.y, boardCenterZ]}
            size={[pad.pl + 0.01, pad.pw + 0.01, boardHeight]}
          />
        ))}
      </Subtract>
    </Colorize>
  )

  const holePads =
    innerHoles &&
    holes.map((hole, index) => (
      <Cylinder
        key={index}
        color="black"
        center={[hole.x, hole.y, boardCenterZ]}
        radius={holeRadius}
        height={boardThickness * 1.07}
      />
    ))

  const rectPads = pads.map((pad, index) => (
    <Cuboid
      key={index}
      center={[pad.x, pad.y, boardCenterZ]}
      size={[pad.pl + 0.01, pad.pw + 0.01, boardHeight]}
    />
  ))
  return (
    <>
      {boardBody}
      <Colorize color="#FFD700">
        {innerHoles ? (
          <Subtract>
            <Union>
              {pads.map((pad, index) => (
                <Cuboid
                  key={index}
                  center={[pad.x, pad.y, boardCenterZ]}
                  size={[pad.pl + 0.01, pad.pw + 0.01, boardHeight]}
                />
              ))}
            </Union>
            {holePads}
          </Subtract>
        ) : (
          rectPads
        )}
      </Colorize>
    </>
  )
}

export default StampBoard
