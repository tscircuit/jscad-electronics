import { Colorize, Cylinder, Subtract, Cuboid, Translate } from "jscad-fiber"

interface ElectrolyticCapacitorProps {
  /** can diameter in mm (footprinter `d`) */
  diameter?: number
  height?: number
  pitch?: number
  bodyColor?: string
  topColor?: string
}

/**
 * Radial aluminum electrolytic capacitor (vertical can).
 */
export const ElectrolyticCapacitor = ({
  diameter = 10.5,
  height = 12.5,
  pitch = 7.5,
  bodyColor = "#1a1a5e",
  topColor = "#c0c0c0",
}: ElectrolyticCapacitorProps) => {
  const radius = diameter / 2
  const legRadius = 0.25

  return (
    <>
      {/* Can body */}
      <Colorize color={bodyColor}>
        <Cylinder
          radius={radius}
          height={height}
          center={[0, 0, height / 2 + 0.4]}
        />
      </Colorize>

      {/* Metal top with score lines */}
      <Colorize color={topColor}>
        <Cylinder
          radius={radius - 0.1}
          height={0.3}
          center={[0, 0, height + 0.4]}
        />
      </Colorize>
      <Colorize color="#808080">
        <Cuboid
          size={[diameter * 0.6, 0.15, 0.05]}
          center={[0, 0, height + 0.56]}
        />
        <Cuboid
          size={[0.15, diameter * 0.6, 0.05]}
          center={[0, 0, height + 0.56]}
        />
      </Colorize>

      {/* Black base ring */}
      <Colorize color="#111">
        <Cylinder radius={radius} height={0.4} center={[0, 0, 0.2]} />
      </Colorize>

      {/* Leads */}
      <Colorize color="#c0c0c0">
        <Cylinder
          radius={legRadius}
          height={3}
          center={[-pitch / 2, 0, -1]}
        />
        <Cylinder
          radius={legRadius}
          height={3}
          center={[pitch / 2, 0, -1]}
        />
      </Colorize>
    </>
  )
}

export default ElectrolyticCapacitor
