import { Colorize, Cuboid, Cylinder, Subtract, Translate } from "jscad-fiber"

export interface Array1206x4Props {
  bodyColor?: string
  leadColor?: string
  topColor?: string
}

export const Array1206x4 = ({
  bodyColor = "#f5f5f5",
  leadColor = "#6d6d6dff",
  topColor = "#222",
}: Array1206x4Props) => {
  const length = 3.2
  const width = 1.6
  const height = 0.45
  const notchCount = 4
  const notchRadius = 0.12
  const padThickness = 0.3
  const padLength = 0.4
  const topThickness = 0.12

  // Evenly space the terminal notches along the long edge
  const notchPositions = Array.from({ length: notchCount }).map(
    (_, i) => (i - (notchCount - 1) / 2) * (length / notchCount),
  )

  return (
    <>
      {/* Body block before notch cuts */}
      <Colorize color={bodyColor}>
        <Subtract>
          <Cuboid size={[width, length, height]} offset={[0, 0, height / 2]} />
          {notchPositions.map((y, i) => (
            <Translate
              key={`r-${i}`}
              offset={{ x: width / 2, y, z: height / 2 }}
            >
              <Cylinder radius={notchRadius} height={height * 2} />
            </Translate>
          ))}
          {notchPositions.map((y, i) => (
            <Translate
              key={`l-${i}`}
              offset={{ x: -width / 2, y, z: height / 2 }}
            >
              <Cylinder radius={notchRadius} height={height * 2} />
            </Translate>
          ))}
        </Subtract>
      </Colorize>

      {/* Metal terminations placed first, then notched to match */}
      {notchPositions.map((y, i) => (
        <Colorize key={`pad-${i}`} color={leadColor}>
          <Subtract>
            <Cuboid
              size={[padThickness, padLength, height + 0.01]}
              offset={[width / 2 - padThickness / 2, y, height / 2]}
            />
            <Translate offset={{ x: width / 2, y, z: height / 2 }}>
              <Cylinder radius={notchRadius} height={height * 2} />
            </Translate>
          </Subtract>
        </Colorize>
      ))}

      {notchPositions.map((y, i) => (
        <Colorize key={`pad-l-${i}`} color={leadColor}>
          <Subtract>
            <Cuboid
              size={[padThickness, padLength, height + 0.01]}
              offset={[-width / 2 + padThickness / 2, y, height / 2]}
            />
            <Translate offset={{ x: -width / 2, y, z: height / 2 }}>
              <Cylinder radius={notchRadius} height={height * 2} />
            </Translate>
          </Subtract>
        </Colorize>
      ))}

      {/* Resistive film strip on top */}
      <Colorize color={topColor}>
        <Cuboid
          size={[width * 0.62, length * 0.92, topThickness]}
          offset={[0, 0, height - topThickness / 2 + 0.01]}
        />
      </Colorize>
    </>
  )
}
