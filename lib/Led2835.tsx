import { Colorize, Cuboid } from "jscad-fiber"

export interface Led2835Props {
  /** X extent of the package (footprinter reports 3.5 for `led2835`). */
  bodyWidth?: number
  /** Y extent of the package. */
  bodyLength?: number
  bodyHeight?: number
  /** Emitter colour when lit — the lens square on the top face. */
  color?: string
  bodyColor?: string
  padColor?: string
  /** Pad centres and widths, so the terminals line up with the footprint. */
  pad1X?: number
  pad1Width?: number
  pad2X?: number
  pad2Width?: number
  padLength?: number
}

/**
 * 2835 chip LED: a flat rectangular package with an emitter window, unlike the
 * symmetric two-terminal chips (0805 etc.) whose pads are mirrored — footprinter
 * gives `led2835` two DIFFERENT pad widths at two different offsets, so the body
 * is not centred on the pads.
 */
export const Led2835 = ({
  bodyWidth = 3.5,
  bodyLength = 2.8,
  bodyHeight = 0.8,
  color = "#ffe08a",
  bodyColor = "#f2f2f2",
  padColor = "#cccccc",
  pad1X = -0.9,
  pad1Width = 2.2,
  pad2X = 1.375,
  pad2Width = 1.25,
  padLength = 2.2,
}: Led2835Props = {}) => {
  const padThickness = 0.1
  const lensHeight = 0.15
  const bodyCenterX = (pad1X + pad2X) / 2
  const lensWidth = bodyWidth * 0.55
  const lensLength = bodyLength * 0.55

  return (
    <>
      {[
        { x: pad1X, w: pad1Width, key: "pad-1" },
        { x: pad2X, w: pad2Width, key: "pad-2" },
      ].map(({ x, w, key }) => (
        <Colorize color={padColor} key={key}>
          <Cuboid
            size={[w, padLength, padThickness]}
            center={[x, 0, padThickness / 2]}
          />
        </Colorize>
      ))}

      <Colorize color={bodyColor}>
        <Cuboid
          size={[bodyWidth, bodyLength, bodyHeight]}
          center={[bodyCenterX, 0, padThickness + bodyHeight / 2]}
        />
      </Colorize>

      <Colorize color={color}>
        <Cuboid
          size={[lensWidth, lensLength, lensHeight]}
          center={[
            bodyCenterX,
            0,
            padThickness + bodyHeight + lensHeight / 2 - 0.05,
          ]}
        />
      </Colorize>
    </>
  )
}

export default Led2835
