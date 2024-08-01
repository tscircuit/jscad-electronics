import { Colorize, RoundedCuboid, Translate } from "jscad-fiber"

export interface ChipBodyProps {
  width: number
  length: number
  height: number
  center: { x: number; y: number; z: number }
}

export const ChipBody = ({ center, width, length, height }: ChipBodyProps) => {
  // TODO the bodies flex a bit outward IRL
  return (
    <Colorize color="#555">
      <Translate offset={center}>
        <Translate offset={{ x: 0, y: height / 2 + 0.15, z: 0 }}>
          <RoundedCuboid roundRadius={0.2} size={[width, height, length]} />
        </Translate>
      </Translate>
    </Colorize>
  )
}
