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
}

export const ChipBody = ({
  center,
  width,
  length,
  height,
  heightAboveSurface = 0.15,
}: ChipBodyProps) => {
  const straightHeight = height * 0.5
  const taperHeight = height - straightHeight
  const taperInset = Math.min(width, length) * 0.12
  const faceWidth = Math.max(width - taperInset, width * 0.75)
  const faceLength = Math.max(length - taperInset, length * 0.75)
  const notchRadius = Math.min(width, length) * 0.12
  const notchCenterZ = height - notchRadius * 0.6
  const notchCenterY = length / 2 - notchRadius * 0.25
  const notchLength = 0.5
  const notchWidth = 0.25
  // TODO the bodies flex a bit outward IRL
  return (
    <Colorize color="#555">
      <Translate offset={center}>
        <Translate offset={{ x: 0, y: 0, z: heightAboveSurface }}>
          <Subtract>
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
            <Translate offset={{ x: 0, y: notchCenterY, z: height }}>
              <Rotate rotation={[0, 0, 0]}>
                <Cylinder radius={notchLength} height={notchWidth} />
              </Rotate>
            </Translate>
          </Subtract>
        </Translate>
      </Translate>
    </Colorize>
  )
}
