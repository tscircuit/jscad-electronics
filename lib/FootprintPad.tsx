import type { PCBSMTPad } from "@tscircuit/soup"
import { Colorize, Cuboid, Translate } from "jscad-fiber"

export const FootprintPad = ({ pad }: { pad: PCBSMTPad }) => {
  if (pad.shape === "rect") {
    return (
      <Colorize color={[255, 0, 0]}>
        <Translate offset={[pad.x, pad.y, 0]}>
          <Cuboid size={[pad.width, pad.height, 0.01]} />
        </Translate>
      </Colorize>
    )
  } else {
    throw new Error("Shape not supported: " + pad.shape)
  }
}
