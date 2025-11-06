import { Colorize, Cuboid, RoundedCylinder, Rotate } from "jscad-fiber"

export interface MINIMELFProps {
  bodyLength?: number
  bodyDiameter?: number
  color?: string
  contactColor?: string
}

export const MINIMELF = ({
  bodyLength = 3.5,
  bodyDiameter = 1.5,
  color = "#3a3a3aff",
  contactColor = "#c6c6c6",
}: MINIMELFProps) => {
  const padLength = 0.5

  return (
    <>
      <Colorize color={color}>
        <Rotate rotation={[0, "90deg", 0]}>
          <RoundedCylinder
            height={bodyLength}
            radius={bodyDiameter / 2}
            roundRadius={0.3}
            center={[-bodyDiameter / 2, 0, 0]}
          />
        </Rotate>
      </Colorize>

      <Colorize color={contactColor}>
        <Rotate rotation={[0, "90deg", 0]}>
          <RoundedCylinder
            height={padLength}
            radius={bodyDiameter / 2}
            roundRadius={0.2}
            center={[-bodyDiameter / 2, 0, -bodyLength / 2]}
          />
        </Rotate>
      </Colorize>

      <Colorize color={contactColor}>
        <Rotate rotation={[0, "90deg", 0]}>
          <RoundedCylinder
            height={padLength}
            radius={bodyDiameter / 2}
            roundRadius={0.2}
            center={[-bodyDiameter / 2, 0, bodyLength / 2]}
          />
        </Rotate>
      </Colorize>
    </>
  )
}

export default MINIMELF
