import { Colorize, Cylinder, ExtrudeLinear, Hull, Polygon } from "jscad-fiber"
import { ChipBody } from "./ChipBody"

export interface CrystalProps {
  horizontalPadPitch?: number
  verticalPadPitch?: number
  padWidth?: number
  padHeight?: number
  bodyHeight?: number
}

type Point = [number, number]

const getTerminalPoints = (
  [centerX, centerY]: Point,
  width: number,
  length: number,
  chamfer: number,
  isPinOne: boolean,
): Point[] => {
  const xDirection = Math.sign(centerX)
  const yDirection = Math.sign(centerY)
  const halfWidth = width / 2
  const halfLength = length / 2
  const innerChamfer = isPinOne ? Math.min(0.32, length * 0.36) : 0
  const outerChamfer = Math.min(chamfer, halfWidth, halfLength)
  const points: Point[] = [
    [-halfWidth, -halfLength],
    [halfWidth, -halfLength],
    [halfWidth, halfLength - outerChamfer],
    [halfWidth - outerChamfer, halfLength],
    [-halfWidth, halfLength],
  ]
  if (innerChamfer) {
    points[0] = [-halfWidth + innerChamfer, -halfLength]
    points.push([-halfWidth, -halfLength + innerChamfer])
  }

  const oriented = points.map(
    ([x, y]) => [centerX + x * xDirection, centerY + y * yDirection] as Point,
  )

  return xDirection * yDirection < 0 ? oriented.reverse() : oriented
}

type RoundedRectProfileOptions = {
  width: number
  length: number
  height: number
  radius: number
  z: number
}

const getRoundedRectProfile = ({
  width,
  length,
  radius,
  height,
  z,
}: RoundedRectProfileOptions) => {
  const x = width / 2 - radius
  const y = length / 2 - radius

  return (
    [
      [-x, -y],
      [x, -y],
      [x, y],
      [-x, y],
    ] as const
  ).map(([cornerX, cornerY], index) => (
    <Cylinder
      key={`${z}-${index}`}
      center={[cornerX, cornerY, z + height / 2]}
      height={height}
      radius={radius}
    />
  ))
}

export const Crystal = ({
  horizontalPadPitch = 2.2,
  verticalPadPitch = 1.7,
  padWidth = 1.4,
  padHeight = 1.2,
  bodyHeight = 0.7,
}: CrystalProps) => {
  const bodyWidth = horizontalPadPitch + padWidth * (5 / 7)
  const bodyLength = verticalPadPitch + padHeight * (2 / 3)
  const terminalThickness = Math.min(0.01, bodyHeight * 0.02)
  const terminalWidth = padWidth * (5 / 7)
  const terminalLength = padHeight * 0.75
  const ceramicTopZ = bodyHeight * (5 / 7)
  const baseHeight = ceramicTopZ - terminalThickness
  const sealHeight = bodyHeight * (2 / 35)
  const sealWidth = bodyWidth * 0.95
  const sealLength = bodyLength * 0.94
  const lidShoulderWidth = bodyWidth * 0.905
  const lidShoulderLength = bodyLength * 0.9
  const lidTopWidth = bodyWidth * 0.83
  const lidTopLength = bodyLength * 0.82
  const lidBaseZ = ceramicTopZ + sealHeight
  const lidProfileHeight = Math.min(0.01, bodyHeight * 0.015)
  const bodyChamfer = Math.min(0.12, bodyLength * 0.05)
  const terminalX = (bodyWidth - terminalWidth) / 2
  const terminalY = (bodyLength - terminalLength) / 2
  const terminalPositions = [
    [-terminalX, -terminalY],
    [terminalX, -terminalY],
    [terminalX, terminalY],
    [-terminalX, terminalY],
  ] satisfies Point[]
  const sealProfile = getRoundedRectProfile({
    width: sealWidth,
    length: sealLength,
    radius: Math.min(0.13, sealLength * 0.08),
    height: sealHeight,
    z: ceramicTopZ,
  })
  const lidProfiles = [
    ...getRoundedRectProfile({
      width: lidShoulderWidth,
      length: lidShoulderLength,
      radius: Math.min(0.14, lidShoulderLength * 0.08),
      height: lidProfileHeight,
      z: lidBaseZ,
    }),
    ...getRoundedRectProfile({
      width: lidTopWidth,
      length: lidTopLength,
      radius: Math.min(0.15, lidTopLength * 0.09),
      height: lidProfileHeight,
      z: bodyHeight - lidProfileHeight,
    }),
  ]

  return (
    <>
      {terminalPositions.map((center, index) => (
        <Colorize key={index} color="#d6a258">
          <ExtrudeLinear height={terminalThickness}>
            <Polygon
              points={getTerminalPoints(
                center,
                terminalWidth,
                terminalLength,
                bodyChamfer,
                index === 0,
              )}
            />
          </ExtrudeLinear>
        </Colorize>
      ))}
      <ChipBody
        center={{ x: 0, y: 0, z: terminalThickness }}
        width={bodyWidth}
        length={bodyLength}
        height={baseHeight - 0.005}
        heightAboveSurface={0}
        color="#34343d"
        taperRatio={0}
        straightHeightRatio={1}
        includeNotch={false}
        chamferSize={bodyChamfer}
      />
      <Colorize color="#d2a057">
        <Hull>{sealProfile}</Hull>
      </Colorize>
      <Colorize color="#b9bec2">
        <Hull>{lidProfiles}</Hull>
      </Colorize>
    </>
  )
}
