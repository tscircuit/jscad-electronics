import {
  Colorize,
  Cuboid,
  Cylinder,
  Hull,
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
          {includeNotch ? (
            <Subtract>
              {body}
              <Translate offset={actualNotchPosition}>
                <Rotate rotation={notchRotation}>
                  <Cylinder radius={notchLength} height={notchWidth} />
                </Rotate>
              </Translate>
            </Subtract>
          ) : (
            body
          )}
        </Translate>
      </Translate>
    </Colorize>
  )
}
