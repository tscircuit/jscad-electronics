import { Cylinder, Hull } from "jscad-fiber"

/**
 * Stadium (capsule) in the XY plane, centred at the origin, extruded `thickness`
 * along Z. Used for pill SMT pads and pill plated-hole copper.
 */
export const PillHull = ({
  width,
  height,
  thickness,
}: {
  width: number
  height: number
  thickness: number
}) => {
  const radius = Math.min(width, height) / 2
  if (!(radius > 0)) return null
  if (Math.abs(width - height) < 1e-9) {
    return <Cylinder radius={radius} height={thickness} />
  }
  const isHorizontal = width > height
  const dx = isHorizontal ? width / 2 - radius : 0
  const dy = isHorizontal ? 0 : height / 2 - radius
  return (
    <Hull>
      <Cylinder radius={radius} height={thickness} center={[-dx, -dy, 0]} />
      <Cylinder radius={radius} height={thickness} center={[dx, dy, 0]} />
    </Hull>
  )
}

export const rotateZDeg = (degrees: number | string | undefined): number => {
  const n = Number(degrees)
  return Number.isFinite(n) ? n : 0
}
