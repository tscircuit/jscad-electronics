import type { PCBSMTPad } from "@tscircuit/soup"
import { Colorize, Cuboid, Translate } from "jscad-fiber"

export const FootprintPad = ({ pad }: { pad: PCBSMTPad }) => {
  if (pad.shape === "rect") {
    return (
      <Colorize color={[255, 0, 0]}>
        <Translate args={[pad.x, 0, pad.y]}>
          <Cuboid size={[pad.width, 0.01, pad.height]} />
        </Translate>
      </Colorize>
    )
  } else {
    throw new Error("Shape not supported: " + pad.shape)
  }
}
