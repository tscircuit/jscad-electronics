import { Colorize, RoundedCuboid, Translate } from "jscad-fiber"

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
  // TODO the bodies flex a bit outward IRL
  return (
    <Colorize color="#555">
      <Translate offset={center}>
        <Translate offset={{ x: 0, y: 0, z: height / 2 + heightAboveSurface }}>
          <RoundedCuboid roundRadius={0.2} size={[width, length, height]} />
        </Translate>
      </Translate>
    </Colorize>
  )
}
