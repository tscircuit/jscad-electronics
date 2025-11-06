import { Colorize, Cuboid, RoundedCylinder, Rotate } from "jscad-fiber"

export interface MicroMELFProps {
  bodyLength?: number
  bodyDiameter?: number
  color?: string
  contactColor?: string
}

export const MicroMELF = ({
  bodyLength = 1.4,
  bodyDiameter = 1.1,
  color = "#3a3a3aff",
  contactColor = "#c6c6c6",
}: MicroMELFProps) => {
  const padLength = 0.20

  return (
    <>
      <Colorize color={color}>
        <Rotate rotation={[0, "90deg", 0]}>
          <RoundedCylinder
            height={bodyLength}
            radius={bodyDiameter / 2}
            roundRadius={padLength / 2}
            center={[-bodyDiameter / 2, 0, 0]}
          />
        </Rotate>
      </Colorize>

      <Colorize color={contactColor}>
        <Rotate rotation={[0, "90deg", 0]}>
          <RoundedCylinder
            height={padLength}
            radius={bodyDiameter / 2}
            roundRadius={padLength/3}
            center={[-bodyDiameter / 2, 0, -bodyLength / 2]}
          />
        </Rotate>
      </Colorize>

      <Colorize color={contactColor}>
        <Rotate rotation={[0, "90deg", 0]}>
          <RoundedCylinder
            height={padLength}
            radius={bodyDiameter / 2}
            roundRadius={padLength/3}
            center={[-bodyDiameter / 2, 0, bodyLength / 2]}
          />
        </Rotate>
      </Colorize>
    </>
  )
}

export default MicroMELF