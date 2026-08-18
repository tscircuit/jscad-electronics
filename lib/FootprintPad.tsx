import type { PcbSmtPad } from "circuit-json"
import {
  Colorize,
  Cuboid,
  ExtrudeLinear,
  Polygon,
  Translate,
} from "jscad-fiber"

const PAD_THICKNESS = 0.01

export const FootprintPad = ({
  pad,
  isPin1,
}: { pad: PcbSmtPad; isPin1?: boolean }) => {
  const color: [number, number, number] = isPin1 ? [0, 255, 0] : [255, 0, 0]

  if (pad.shape === "rect") {
    return (
      <Colorize color={color}>
        <Translate offset={[pad.x, pad.y, -0.005]}>
          <Cuboid size={[pad.width, pad.height, PAD_THICKNESS]} />
        </Translate>
      </Colorize>
    )
  }

  // A polygon pad is how footprinter describes a tab — SOT-89's, for one. It
  // used to throw, which meant a footprint could not be rendered WITH ITS PADS
  // at all, and the failure named the shape rather than the footprint.
  if (pad.shape === "polygon") {
    const points = (pad.points ?? []).map(
      ({ x, y }) => [x, y] as [number, number],
    )
    if (points.length < 3) return null
    return (
      <Colorize color={color}>
        <Translate offset={[0, 0, -0.005]}>
          <ExtrudeLinear height={PAD_THICKNESS}>
            <Polygon points={points} />
          </ExtrudeLinear>
        </Translate>
      </Colorize>
    )
  }

  throw new Error("Shape not supported: " + pad.shape)
}
