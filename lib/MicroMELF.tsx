import {
  Colorize,
  Cuboid,
  RoundedCylinder,
  Rotate,
  RoundedCuboid,
} from "jscad-fiber"

export interface MicroMELFProps {
  bodyLength?: number
  bodyDiameter?: number
  color?: string
  contactColor?: string
  cathodeIdentification?: string
}

export const MicroMELF = ({
  bodyLength = 1.4,
  bodyDiameter = 1.1,
  color = "#3a3a3aff",
  contactColor = "#c6c6c6",
  cathodeIdentification = "#111",
}: MicroMELFProps) => {
  const padLength = 0.2

  return (
    <>
      <Colorize color={color}>
        <Rotate rotation={[0, "90deg", 0]}>
          <RoundedCuboid
            size={[bodyDiameter, bodyDiameter, bodyLength - padLength / 2]}
            roundRadius={padLength}
            center={[-bodyDiameter / 2, 0, 0]}
          />
        </Rotate>
      </Colorize>
      {/* Cathode identification: a dark stripe near the left end of the body */}

      <Colorize color={cathodeIdentification}>
        <Rotate rotation={[0, "90deg", 0]}>
          <RoundedCuboid
            size={[bodyDiameter * 1.01, bodyDiameter * 1.01, bodyLength / 3]}
            roundRadius={padLength}
            center={[-bodyDiameter / 2, 0, -bodyLength / 4]}
          />
        </Rotate>
      </Colorize>

      <Colorize color={contactColor}>
        <Rotate rotation={[0, "90deg", 0]}>
          <RoundedCylinder
            height={padLength}
            radius={bodyDiameter / 2}
            roundRadius={padLength / 3}
            center={[-bodyDiameter / 2, 0, -bodyLength / 2]}
          />
        </Rotate>
      </Colorize>

      <Colorize color={contactColor}>
        <Rotate rotation={[0, "90deg", 0]}>
          <RoundedCylinder
            height={padLength}
            radius={bodyDiameter / 2}
            roundRadius={padLength / 3}
            center={[-bodyDiameter / 2, 0, bodyLength / 2]}
          />
        </Rotate>
      </Colorize>
    </>
  )
}

export default MicroMELF
