import { Colorize, Cuboid, Hull } from "jscad-fiber"

export type Pin3dProps = {
  x: number
  y: number
  longLength: number
  shortLength: number
  longCenterZ: number
  shortCenterZ: number
  pinThickness?: number
  taperedRatio?: number
  color?: string
  renderLong?: boolean
  renderShort?: boolean
}

export const Pin3d = ({
  x,
  y,
  longLength,
  shortLength,
  longCenterZ,
  shortCenterZ,
  pinThickness = 0.63,
  taperedRatio = 1.8,
  color = "gold",
  renderLong = true,
  renderShort = true,
}: Pin3dProps) => {
  const taperedThickness = pinThickness / taperedRatio

  return (
    <Colorize color={color}>
      {renderLong && (
        <Hull>
          <Cuboid
            size={[pinThickness, pinThickness, longLength * 0.9]}
            center={[x, y, longCenterZ]}
          />
          <Cuboid
            size={[taperedThickness, taperedThickness, longLength]}
            center={[x, y, longCenterZ]}
          />
        </Hull>
      )}
      {renderShort && (
        <Hull>
          <Cuboid
            size={[pinThickness, pinThickness, shortLength * 0.9]}
            center={[x, y, shortCenterZ]}
          />
          <Cuboid
            size={[taperedThickness, taperedThickness, shortLength]}
            center={[x, y, shortCenterZ]}
          />
        </Hull>
      )}
    </Colorize>
  )
}

export default Pin3d
