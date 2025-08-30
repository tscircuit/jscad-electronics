import { ChipBody } from "./ChipBody"
import { Colorize, Cuboid, Translate } from "jscad-fiber"

export const SOD523 = ({ fullWidth = 1.65, fullLength = 0.8 }) => {
  const bodyWidth = 1.25
  const bodyLength = 0.6
  const bodyHeight = 0.6

  const terminalWidth = (fullWidth - bodyWidth) / 2
  const terminalLength = fullLength
  const terminalHeight = 0.1

  return (
    <>
      <Colorize color="#C0C0C0">
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

      <Colorize color="#C0C0C0">
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

      <ChipBody
        center={{ x: 0, y: 0, z: 0 }}
        width={bodyWidth}
        length={bodyLength}
        height={bodyHeight}
      />
    </>
  )
}

export default SOD523
