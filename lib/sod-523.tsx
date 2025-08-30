import { Colorize, Cuboid, Translate, RoundedCuboid } from "jscad-fiber"

export const SOD523 = ({ fullWidth = 1.65, fullLength = 0.8 }) => {
  const bodyWidth = 1.25
  const bodyLength = 0.6
  const bodyHeight = 0.6

  // Terminal contacts on shorter ends
  const terminalWidth = (fullWidth - bodyWidth) / 2
  const terminalLength = fullLength
  const terminalHeight = 0.05 // Very thin, flush with bottom

  // Polarity marking line
  const markingWidth = 0.08
  const markingLength = fullLength * 0.7
  const markingThickness = 0.01

  return (
    <>
      {/* Left terminal contact (cathode side) - flat silver metallic */}
      <Colorize color="#E0E0E0">
        <Translate
          offset={{
            x: -bodyWidth / 2 - terminalWidth / 2,
            y: 0,
            z: terminalHeight / 2,
          }}
        >
          <Cuboid size={[terminalWidth, terminalLength, terminalHeight]} />
        </Translate>
      </Colorize>

      {/* Right terminal contact (anode side) - flat silver metallic */}
      <Colorize color="#E0E0E0">
        <Translate
          offset={{
            x: bodyWidth / 2 + terminalWidth / 2,
            y: 0,
            z: terminalHeight / 2,
          }}
        >
          <Cuboid size={[terminalWidth, terminalLength, terminalHeight]} />
        </Translate>
      </Colorize>

      {/* Main rectangular body with slightly beveled sides */}
      <Colorize color="#555">
        <Translate offset={{ x: 0, y: 0, z: bodyHeight / 2 + terminalHeight }}>
          <RoundedCuboid
            roundRadius={0.03}
            size={[bodyWidth, bodyLength, bodyHeight]}
          />
        </Translate>
      </Colorize>

      {/* Polarity marking line on top surface near cathode end */}
      <Colorize color="#AAAAAA">
        <Translate
          offset={{
            x: -bodyWidth / 2 + markingWidth / 2 + 0.05,
            y: 0,
            z: bodyHeight + terminalHeight + markingThickness / 2,
          }}
        >
          <Cuboid size={[markingWidth, markingLength, markingThickness]} />
        </Translate>
      </Colorize>
    </>
  )
}

export default SOD523
