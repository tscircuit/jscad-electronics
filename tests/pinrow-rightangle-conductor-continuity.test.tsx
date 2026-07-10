import { expect, test } from "bun:test"
import {
  getOverlap,
  getRightAnglePinParts,
} from "./helpers/right-angle-pin-geometry"

/**
 * A right-angle through-hole pin is one conductor bent 90 degrees: the vertical
 * tail that goes through the board and the horizontal mating pin have to share
 * the bend, or the "pin" is two solids floating apart -- it renders as a gap and
 * exports as a disconnected mesh.
 *
 * They did not meet. The tail and the mating pin were positioned independently
 * (the mating pin by a hardcoded translate/rotate), so on a single upright pin
 * the tail occupied y -0.32..0.32 / z 1.45..4.5 while the mating pin sat at
 * y -9.9..-3.9 / z 0.69..1.32: ~3.6mm apart in Y and not touching in Z either.
 * Inverting made it worse -- see the sibling tests.
 */
test.each([
  ["upright", {}],
  ["inverted", { invert: true }],
] as const)(
  "%s right-angle pin joins its vertical tail to its mating pin at the bend",
  (_orientation, props) => {
    const { tail, matingPin } = getRightAnglePinParts(props)

    const shared = getOverlap(tail, matingPin)

    expect(shared.x).toBeGreaterThan(0)
    expect(shared.y).toBeGreaterThan(0)
    expect(shared.z).toBeGreaterThan(0)
  },
)
