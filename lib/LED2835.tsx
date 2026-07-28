import { Colorize, Cuboid } from "jscad-fiber"

interface LED2835Props {
  bodyWidth?: number
  bodyLength?: number
  bodyHeight?: number
}

/**
 * 2835 SMD LED (2.8 x 3.5mm): white package with yellow phosphor area.
 */
export const LED2835 = ({
  bodyWidth = 3.5,
  bodyLength = 2.8,
  bodyHeight = 0.8,
}: LED2835Props) => {
  return (
    <>
      {/* Two pads underneath (asymmetric, anode wider) */}
      <Colorize color="#c0c0c0">
        <Cuboid
          size={[2.2, 2.2, 0.1]}
          center={[-0.9, 0, 0.05]}
        />
        <Cuboid
          size={[1.25, 2.2, 0.1]}
          center={[1.375, 0, 0.05]}
        />
      </Colorize>

      {/* White body */}
      <Colorize color="#f2f2f2">
        <Cuboid
          size={[bodyWidth, bodyLength, bodyHeight]}
          center={[0, 0, bodyHeight / 2 + 0.1]}
        />
      </Colorize>

      {/* Phosphor / emitting area */}
      <Colorize color="#f5d76e">
        <Cuboid
          size={[bodyWidth * 0.6, bodyLength * 0.7, 0.15]}
          center={[0, 0, bodyHeight + 0.1]}
        />
      </Colorize>
    </>
  )
}

export default LED2835
