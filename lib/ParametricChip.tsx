import { Cuboid } from "jscad-fiber"

/**
 * A two-terminal chip body sized from its land pattern.
 *
 * Footprinter names a chip either by EIA size (`0402`) or parametrically by the
 * pads it wants (`res_p0.8656mm_pw0.5657mm_ph0.54mm`). The named sizes have
 * hand-modelled bodies -- `A0402` and friends -- and keep using them. This is
 * for the parametric form, which carries no size to look up and until now
 * rendered nothing at all.
 *
 * The pads are the only evidence available, so the body is derived from them:
 *
 * - **length** is the pad pitch. A chip's terminations sit centred on its pads,
 *   so pitch tracks body length closely: across every EIA size from 0201 up it
 *   is within 10% of the real part (0402: 1.02 vs 1.0mm, 0603: 1.65 vs 1.6mm,
 *   1206: 2.93 vs 3.2mm).
 * - **width and height** are the pad height less a fillet allowance. A land
 *   pattern is drawn wider than the part so solder can wet the ends, by
 *   5-30% depending on the size; 0.85 is the middle of that range. Chips of
 *   this class are near-square in section, so the same figure serves for height.
 *
 * The result is a *plausible* body, not a datasheet one -- accurate to about
 * 15% for 0201 and larger, and deliberately over-estimating for 01005, where a
 * land pattern is proportionally much larger than the part. That is the right
 * trade for a part that would otherwise be invisible: an approximate body shows
 * the board is populated and shows what a clearance check has to clear, while
 * nothing at all silently hides a component.
 */
export const ParametricChip = ({
  padPitch,
  padHeight,
  color = "#333",
}: {
  /** Centre-to-centre distance between the two pads, mm. */
  padPitch: number
  /** Pad extent across the part, mm. */
  padHeight: number
  color?: string
}) => {
  const fullLength = padPitch
  const width = padHeight * 0.85
  const height = width
  // Matches the 20% proportion the hand-modelled A-series uses.
  const terminatorWidth = fullLength * 0.2
  const bodyLength = fullLength - terminatorWidth * 2

  return (
    <>
      <Cuboid
        size={[bodyLength, width, height]}
        offset={[0, 0, height / 2]}
        color={color}
      />
      <Cuboid
        size={[terminatorWidth, height, width]}
        offset={[fullLength / 2 - terminatorWidth / 2, 0, height / 2]}
        color="#ccc"
      />
      <Cuboid
        size={[terminatorWidth, height, width]}
        offset={[-fullLength / 2 + terminatorWidth / 2, 0, height / 2]}
        color="#ccc"
      />
    </>
  )
}
