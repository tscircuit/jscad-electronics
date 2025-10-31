import type { ReactNode } from "react"
import {
  Colorize,
  Cuboid,
  Cylinder,
  ExtrudeLinear,
  Hull,
  Polygon,
  Rotate,
  Subtract,
  Translate,
  Union,
} from "jscad-fiber"
export interface ChipBodyProps {
  width: number
  length: number
  height: number
  heightAboveSurface?: number
  center: { x: number; y: number; z: number }
  color?: string
  taperRatio?: number
  faceRatio?: number
  straightHeightRatio?: number
  includeNotch?: boolean
  notchRadius?: number
  notchPosition?: { x: number; y: number; z: number }
  notchRotation?: [number, number, number]
  notchLength?: number
  notchWidth?: number
  chamferSize?: number
}

export const ChipBody = ({
  center,
  width,
  length,
  height,
  heightAboveSurface = 0.15,
  color = "#555",
  taperRatio = 0.12,
  faceRatio = 0.75,
  straightHeightRatio = 0.5,
  includeNotch = true,
  notchRadius,
  notchPosition,
  notchRotation = [0, 0, 0],
  notchLength = 0.5,
  notchWidth = 0.25,
  chamferSize = 0,
}: ChipBodyProps) => {
  const straightHeight = height * straightHeightRatio
  const taperHeight = height - straightHeight
  const taperInset = Math.min(width, length) * taperRatio
  const faceWidth = Math.max(width - taperInset, width * faceRatio)
  const faceLength = Math.max(length - taperInset, length * faceRatio)
  const defaultNotchRadius = Math.min(width, length) * 0.12
  const actualNotchRadius = notchRadius ?? defaultNotchRadius
  const defaultNotchPosition = {
    x: 0,
    y: length / 2 - actualNotchRadius * 0.25,
    z: height,
  }
  const actualNotchPosition = notchPosition ?? defaultNotchPosition
  const effectiveChamfer = Math.max(0, Math.min(chamferSize, width / 2, length / 2))
  const cutouts: ReactNode[] = []
  if (includeNotch) {
    cutouts.push(
      <Translate key="notch" offset={actualNotchPosition}>
        <Rotate rotation={notchRotation}>
          <Cylinder radius={notchLength} height={notchWidth} />
        </Rotate>
      </Translate>,
    )
  }
  if (effectiveChamfer > 0) {
    const chamferHeight = height + 1
    const chamferZOffset = -0.5
    const chamferCorners: Array<[number, number]> = [
      [1, 1],
      [-1, 1],
      [-1, -1],
      [1, -1],
    ]
    chamferCorners.forEach(([sx, sy], index) => {
      const points: Array<[number, number]> =
        sx * sy > 0
          ? [
              [0, 0],
              [-sx * effectiveChamfer, 0],
              [0, -sy * effectiveChamfer],
            ]
          : [
              [0, 0],
              [0, -sy * effectiveChamfer],
              [-sx * effectiveChamfer, 0],
            ]
      cutouts.push(
        <Translate
          key={`chamfer-${index}`}
          offset={{
            x: (width / 2) * sx,
            y: (length / 2) * sy,
            z: chamferZOffset,
          }}
        >
          <ExtrudeLinear height={chamferHeight}>
            <Polygon points={points} />
          </ExtrudeLinear>
        </Translate>,
      )
    })
  }
  const body = (
    <Union>
      <Hull>
        <Translate z={0.005}>
          <Cuboid size={[faceWidth, faceLength, 0.01]} />
        </Translate>
        <Translate z={straightHeight}>
          <Cuboid size={[width, length, 0.01]} />
        </Translate>
      </Hull>
      <Hull>
        <Translate z={straightHeight}>
          <Cuboid size={[width, length, 0.01]} />
        </Translate>
        <Translate z={straightHeight + taperHeight}>
          <Cuboid size={[faceWidth, faceLength, 0.01]} />
        </Translate>
      </Hull>
    </Union>
  )

  // TODO the bodies flex a bit outward IRL
  return (
    <Colorize color={color}>
      <Translate offset={center}>
        <Translate offset={{ x: 0, y: 0, z: heightAboveSurface }}>
          {cutouts.length ? (
            <Subtract>
              {body}
              {cutouts}
            </Subtract>
          ) : (
            body
          )}
        </Translate>
      </Translate>
    </Colorize>
  )
}
