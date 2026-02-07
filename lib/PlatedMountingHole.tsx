import { Colorize, Cylinder, Subtract, Translate } from "jscad-fiber"

interface PlatedMountingHoleProps {
  holeDiameter?: number
  padDiameter?: number
  height?: number
  color?: string
  zOffset?: number
}

export const PlatedMountingHole = ({
  holeDiameter = 2.8, // Ø 2.80 ± 0.05 mm hole diameter
  padDiameter = 4.2, // Ø 4.2 ± 0.3 mm pad diameter
  height = 0.01,
  color = "#b87333", // Copper color
  zOffset = 0.5, // Lifted above PCB surface for better visibility
}: PlatedMountingHoleProps) => {
  return (
    <Translate offset={[0, 0, zOffset]}>
      <Colorize color={color}>
        <Subtract>
          <Cylinder radius={padDiameter / 2} height={height} />
          <Cylinder radius={holeDiameter / 2} height={height} />
        </Subtract>
      </Colorize>
    </Translate>
  )
}
