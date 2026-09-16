import { Colorize, Cylinder, RoundedCylinder, Rotate } from "jscad-fiber"

export interface MINIMELFProps {
  bodyLength?: number
  bodyDiameter?: number
  color?: string
  contactColor?: string
  bandColor?: string
}

export const MINIMELF = ({
  bodyLength = 3.5,
  bodyDiameter = 1.5,
  color = "#202020",
  contactColor = "#c6c6c6",
  bandColor = "#f2f2f2",
}: MINIMELFProps) => {
  // Vishay LL4148 outline: total L=3.3–3.7, D=1.4–1.6, terminals <=0.47 mm.
  // https://www.vishay.com/docs/85557/ll4148.pdf
  // bodyLength describes the complete case, including both end contacts.
  const contactLength = 0.4
  const glassLength = bodyLength - 2 * contactLength + 0.04
  const contactOffset = (bodyLength - contactLength) / 2
  // Seat each metal cap into the thin pad instead of touching it along a line.
  const contactRadius = bodyDiameter / 2 + 0.02
  const bandLength = 0.14
  const bandOffset = -bodyLength / 2 + contactLength + 0.35

  return (
    <>
      <Colorize color={color}>
        <Rotate rotation={[0, "90deg", 0]}>
          <RoundedCylinder
            height={glassLength}
            radius={bodyDiameter / 2}
            roundRadius={0.05}
            center={[-bodyDiameter / 2, 0, 0]}
          />
        </Rotate>
      </Colorize>

      <Colorize color={bandColor}>
        <Rotate rotation={[0, "90deg", 0]}>
          <Cylinder
            height={bandLength}
            radius={bodyDiameter / 2 + 0.002}
            center={[-bodyDiameter / 2, 0, bandOffset]}
          />
        </Rotate>
      </Colorize>

      <Colorize color={contactColor}>
        <Rotate rotation={[0, "90deg", 0]}>
          <RoundedCylinder
            height={contactLength}
            radius={contactRadius}
            roundRadius={0.04}
            center={[-bodyDiameter / 2, 0, -contactOffset]}
          />
        </Rotate>
      </Colorize>

      <Colorize color={contactColor}>
        <Rotate rotation={[0, "90deg", 0]}>
          <RoundedCylinder
            height={contactLength}
            radius={contactRadius}
            roundRadius={0.04}
            center={[-bodyDiameter / 2, 0, contactOffset]}
          />
        </Rotate>
      </Colorize>
    </>
  )
}

export default MINIMELF
