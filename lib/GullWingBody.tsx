import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

export interface SmdLeadPad {
  x: number
  y: number
  width?: number
  height?: number
}

export interface GullWingBodyProps {
  /** X extent of the moulded body. */
  bodyWidth: number
  /** Y extent of the moulded body. */
  bodyLength: number
  bodyHeight?: number
  /** Where each lead meets the board, from the footprint's own pads. */
  pads: SmdLeadPad[]
  leadThickness?: number
  /** How high the lead rises from the board to the body, as a fraction of the body height. */
  leadHeightRatio?: number
}

/**
 * A small-outline package with gull-wing leads on its left and right faces,
 * one lead per PAD.
 *
 * Two things come from two different places on purpose:
 *
 *  - the body is the designation's (`bodyWidth`/`bodyLength` are passed in
 *    from the package outline, never derived from the land pattern);
 *  - the leads are the footprint's, because lead COUNT is not a property of a
 *    body outline. SOT-23-5 and SOT-23-6 share a body; SC-70-4 and SC-70-6
 *    share a body. A body picked by outline alone ends up with the wrong
 *    number of legs, which is what this component exists to prevent.
 *
 * The leg itself is `SmdChipLead`, the same S-curve every other gull-wing part
 * here uses (SOIC, SOT-235, SOT-223, MSOP, QFP, MS-012). Anything else is a
 * second kind of leg in a repo that already has one.
 */
export const GullWingBody = ({
  bodyWidth,
  bodyLength,
  bodyHeight = 1,
  pads,
  leadThickness = 0.15,
  leadHeightRatio = 0.75,
}: GullWingBodyProps) => {
  const centerX = pads.reduce((sum, pad) => sum + pad.x, 0) / (pads.length || 1)
  const centerY = pads.reduce((sum, pad) => sum + pad.y, 0) / (pads.length || 1)
  const leadHeight = bodyHeight * leadHeightRatio

  // The body is centred on the PADS, not on the footprint origin. Normally
  // those are the same; for footprinter's `sot343` they are not — its pads sit
  // at -1.056 and +0.550 where SC-70-4's land is symmetric about the origin
  // (KiCad has ±0.825). A part solders to the centre of its pads, so following
  // them keeps the leads equal and attached; following the origin would put a
  // symmetric package visibly off its own land.

  return (
    <>
      <ChipBody
        center={{ x: centerX, y: centerY, z: 0 }}
        width={bodyWidth}
        length={bodyLength}
        height={bodyHeight}
      />

      {pads.map((pad) => {
        const padWidth = pad.width ?? 0.4
        const padLength = pad.height ?? 0.4
        const side = pad.x >= centerX ? 1 : -1
        // The lead runs from the OUTER edge of its pad to the body face, plus
        // a little more so it merges into the body instead of stopping at it.
        //
        // Both halves of that matter. `SmdChipLead` draws from its anchor
        // inward by `bodyDistance`, so anchoring outboard of the pad (as the
        // fixed-geometry parts do, where the distance is generous enough to
        // hide it) leaves the inner end short of the body: 0.125mm of daylight
        // on SC-70-4 and 0.215mm on SOT-23-6, with the leg visibly floating.
        const outerX = pad.x + (side * padWidth) / 2
        const run = Math.max(Math.abs(outerX - centerX) - bodyWidth / 2, 0.1)
        const overlap = Math.min(0.15, bodyWidth * 0.15)

        return (
          <SmdChipLead
            key={`lead-${pad.x}-${pad.y}`}
            rotation={side > 0 ? Math.PI : 0}
            position={{
              x: outerX,
              y: pad.y,
              z: leadThickness / 2,
            }}
            width={padLength}
            thickness={leadThickness}
            padContactLength={padWidth * 0.6}
            bodyDistance={run + overlap}
            height={leadHeight}
          />
        )
      })}
    </>
  )
}

export default GullWingBody
