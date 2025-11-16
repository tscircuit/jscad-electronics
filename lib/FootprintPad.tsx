import type { PcbSmtPad } from "circuit-json"
import { Colorize, Cuboid, Translate } from "jscad-fiber"

export const FootprintPad = ({
  pad,
  isPin1,
}: { pad: PcbSmtPad; isPin1?: boolean }) => {
  if (pad.shape === "rect") {
    const color: [number, number, number] = isPin1 ? [0, 255, 0] : [255, 0, 0]
    return (
      <Colorize color={color}>
        <Translate offset={[pad.x, pad.y, -0.005]}>
          <Cuboid size={[pad.width, pad.height, 0.01]} />
        </Translate>
      </Colorize>
    )
  } else {
    throw new Error("Shape not supported: " + pad.shape)
  }
}
